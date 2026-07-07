// // ============================================
// // SUPABASE CLIENT & API SERVICES
// // ============================================
// // File: src/services/supabaseApi.js
// // Implementasi lengkap untuk semua CRUD operations

// import { supabase } from "../lib/supabaseClient";

// // ============================================
// // AUTHENTICATION SERVICES
// // ============================================

// export const authService = {
//   // Sign up
//   async signup(email, password, fullName, phone, role = "pelanggan") {
//     try {
//       // 1. Create auth user
//       const { data: authData, error: authError } = await supabase.auth.signUp({
//         email,
//         password,
//         options: {
//           data: { full_name: fullName, phone },
//         },
//       });

//       if (authError) throw authError;

//       // 2. Create user profile
//       const { error: profileError } = await supabase.from("users").insert({
//         id: authData.user.id,
//         email,
//         role,
//         full_name: fullName,
//         phone,
//       });

//       if (profileError) throw profileError;

//       // 3. Create role-specific profile
//       if (role === "pelanggan") {
//         await supabase.from("customers").insert({
//           user_id: authData.user.id,
//           address: "",
//         });
//       } else if (role === "kurir") {
//         await supabase.from("couriers").insert({
//           user_id: authData.user.id,
//         });
//       }

//       return { ok: true, user: authData.user };
//     } catch (error) {
//       return { ok: false, error: error.message };
//     }
//   },

//   // Sign in
//   async signin(email, password) {
//     try {
//       const { data, error } = await supabase.auth.signInWithPassword({
//         email,
//         password,
//       });

//       if (error) throw error;

//       // Fetch user profile
//       const { data: profile } = await supabase
//         .from("users")
//         .select("*")
//         .eq("id", data.user.id)
//         .single();

//       return { ok: true, user: data.user, profile };
//     } catch (error) {
//       return { ok: false, error: error.message };
//     }
//   },

//   // Sign out
//   async signout() {
//     try {
//       const { error } = await supabase.auth.signOut();
//       if (error) throw error;
//       return { ok: true };
//     } catch (error) {
//       return { ok: false, error: error.message };
//     }
//   },

//   // Get current session
//   async getSession() {
//     const { data } = await supabase.auth.getSession();
//     return data?.session;
//   },

//   // Change password
//   async changePassword(newPassword) {
//     try {
//       const { error } = await supabase.auth.updateUser({ password: newPassword });
//       if (error) throw error;
//       return { ok: true };
//     } catch (error) {
//       return { ok: false, error: error.message };
//     }
//   },

//   // Password reset
//   async resetPassword(email) {
//     try {
//       const { error } = await supabase.auth.resetPasswordForEmail(email);
//       if (error) throw error;
//       return { ok: true };
//     } catch (error) {
//       return { ok: false, error: error.message };
//     }
//   },
// };

// // ============================================
// // CUSTOMERS SERVICES
// // ============================================

// export const customerService = {
//   // Get customer profile
//   async getProfile(customerId) {
//     try {
//       const { data, error } = await supabase
//         .from("customers")
//         .select("*, user:users(*)")
//         .eq("id", customerId)
//         .single();

//       if (error) throw error;
//       return { ok: true, data };
//     } catch (error) {
//       return { ok: false, error: error.message };
//     }
//   },

//   // Update customer profile
//   async updateProfile(customerId, updates) {
//     try {
//       const { data, error } = await supabase
//         .from("customers")
//         .update(updates)
//         .eq("id", customerId)
//         .select()
//         .single();

//       if (error) throw error;
//       return { ok: true, data };
//     } catch (error) {
//       return { ok: false, error: error.message };
//     }
//   },

//   // Get customer orders
//   async getOrders(customerId, filters = {}) {
//     try {
//       let query = supabase
//         .from("orders")
//         .select(
//           `
//           *,
//           service:services(*),
//           pickup_schedule:schedules(id, schedule_date, schedule_time),
//           delivery_schedule:schedules(id, schedule_date, schedule_time),
//           delivery_proofs(*)
//         `
//         )
//         .eq("customer_id", customerId);

//       // Apply filters
//       if (filters.status) query = query.eq("status", filters.status);
//       if (filters.payment_status) query = query.eq("payment_status", filters.payment_status);
//       if (filters.startDate) query = query.gte("created_at", filters.startDate);
//       if (filters.endDate) query = query.lte("created_at", filters.endDate);

//       const { data, error } = await query.order("created_at", { ascending: false });

//       if (error) throw error;
//       return { ok: true, data };
//     } catch (error) {
//       return { ok: false, error: error.message };
//     }
//   },

//   // Get dashboard stats
//   async getDashboardStats(customerId) {
//     try {
//       const { data: orders } = await supabase
//         .from("orders")
//         .select("status, payment_status")
//         .eq("customer_id", customerId);

//       const stats = {
//         totalOrders: orders.length,
//         completed: orders.filter((o) => o.status === "selesai").length,
//         inProgress: orders.filter((o) => o.status === "diproses").length,
//         pending: orders.filter((o) => o.payment_status === "belum_lunas").length,
//       };

//       return { ok: true, data: stats };
//     } catch (error) {
//       return { ok: false, error: error.message };
//     }
//   },
// };

// // ============================================
// // ORDERS SERVICES
// // ============================================

// export const orderService = {
//   // Create new order
//   async create(payload) {
//     try {
//       // Generate order code
//       const { count } = await supabase.from("orders").select("*", { count: "exact", head: true });
//       const orderCode = `#P${String(count + 1).padStart(3, "0")}`;

//       // Get service details
//       const { data: service } = await supabase
//         .from("services")
//         .select("*")
//         .eq("id", payload.service_id)
//         .single();

//       const { data, error } = await supabase
//         .from("orders")
//         .insert({
//           order_code: orderCode,
//           customer_id: payload.customer_id,
//           service_id: payload.service_id,
//           delivery_type: payload.delivery_type,
//           customer_notes: payload.notes || "",
//           status: "pending",
//           payment_status: "belum_lunas",
//           price_per_kg: service.price_per_kg,
//         })
//         .select()
//         .single();

//       if (error) throw error;

//       // Create notification
//       await supabase.from("notifications").insert({
//         user_id: payload.user_id,
//         type: "order_created",
//         title: "Pesanan Baru",
//         message: `Pesanan ${orderCode} telah dibuat`,
//         related_order_id: data.id,
//       });

//       return { ok: true, data };
//     } catch (error) {
//       return { ok: false, error: error.message };
//     }
//   },

//   // Get order detail
//   async getDetail(orderId) {
//     try {
//       const { data, error } = await supabase
//         .from("orders")
//         .select(
//           `
//           *,
//           service:services(*),
//           customer:customers(*, user:users(*)),
//           delivery_proofs(*)
//         `
//         )
//         .eq("id", orderId)
//         .single();

//       if (error) throw error;
//       return { ok: true, data };
//     } catch (error) {
//       return { ok: false, error: error.message };
//     }
//   },

//   // Update order
//   async update(orderId, updates) {
//     try {
//       const { data, error } = await supabase
//         .from("orders")
//         .update(updates)
//         .eq("id", orderId)
//         .select()
//         .single();

//       if (error) throw error;
//       return { ok: true, data };
//     } catch (error) {
//       return { ok: false, error: error.message };
//     }
//   },

//   // Update order status
//   async updateStatus(orderId, status) {
//     try {
//       const { data, error } = await supabase
//         .from("orders")
//         .update({ status })
//         .eq("id", orderId)
//         .select()
//         .single();

//       if (error) throw error;

//       // Create notification
//       const { data: order } = await this.getDetail(orderId);
//       await supabase.from("notifications").insert({
//         user_id: order.customer.user_id,
//         type: "status_update",
//         title: "Status Pesanan Berubah",
//         message: `Pesanan ${order.order_code} status berubah menjadi ${status}`,
//         related_order_id: orderId,
//       });

//       return { ok: true, data };
//     } catch (error) {
//       return { ok: false, error: error.message };
//     }
//   },

//   // Book schedule slot
//   async bookSlot(orderId, scheduleId, type = "pickup") {
//     try {
//       // Get schedule
//       const { data: schedule } = await supabase
//         .from("schedules")
//         .select("*")
//         .eq("id", scheduleId)
//         .single();

//       // Check capacity
//       if (schedule.current_slots >= schedule.max_capacity) {
//         throw new Error("Slot penuh");
//       }

//       // Update order
//       const updateData = {};
//       if (type === "pickup") {
//         updateData.pickup_schedule_id = scheduleId;
//       } else {
//         updateData.delivery_schedule_id = scheduleId;
//       }
//       updateData.scheduled_date = schedule.schedule_date;
//       updateData.scheduled_time = schedule.schedule_time;

//       const { error: updateError } = await supabase
//         .from("orders")
//         .update(updateData)
//         .eq("id", orderId);

//       if (updateError) throw updateError;

//       // Increment slot
//       await supabase
//         .from("schedules")
//         .update({ current_slots: schedule.current_slots + 1 })
//         .eq("id", scheduleId);

//       return { ok: true };
//     } catch (error) {
//       return { ok: false, error: error.message };
//     }
//   },

//   // Cancel order
//   async cancel(orderId) {
//     try {
//       const { error } = await supabase
//         .from("orders")
//         .update({ status: "dibatalkan" })
//         .eq("id", orderId);

//       if (error) throw error;
//       return { ok: true };
//     } catch (error) {
//       return { ok: false, error: error.message };
//     }
//   },
// };

// // ============================================
// // SCHEDULES SERVICES
// // ============================================

// export const scheduleService = {
//   // Get available schedules
//   async getAvailable(type, filters = {}) {
//     try {
//       const tomorrow = new Date();
//       tomorrow.setDate(tomorrow.getDate() + 1);

//       let query = supabase
//         .from("schedules")
//         .select("*")
//         .eq("schedule_type", type)
//         .eq("is_active", true)
//         .gte("schedule_date", filters.startDate || tomorrow.toISOString().split("T")[0]);

//       if (filters.endDate) {
//         query = query.lte("schedule_date", filters.endDate);
//       }

//       const { data, error } = await query.order("schedule_date", { ascending: true });

//       if (error) throw error;

//       // Filter by available slots
//       const available = data.filter((s) => s.current_slots < s.max_capacity);
//       return { ok: true, data: available };
//     } catch (error) {
//       return { ok: false, error: error.message };
//     }
//   },

//   // Create schedule (admin)
//   async create(payload) {
//     try {
//       const { data, error } = await supabase
//         .from("schedules")
//         .insert({
//           schedule_date: payload.date,
//           schedule_time: payload.time,
//           schedule_type: payload.type,
//           max_capacity: payload.capacity,
//         })
//         .select()
//         .single();

//       if (error) throw error;
//       return { ok: true, data };
//     } catch (error) {
//       return { ok: false, error: error.message };
//     }
//   },

//   // Delete schedule (admin)
//   async delete(scheduleId) {
//     try {
//       const { error } = await supabase.from("schedules").delete().eq("id", scheduleId);

//       if (error) throw error;
//       return { ok: true };
//     } catch (error) {
//       return { ok: false, error: error.message };
//     }
//   },
// };

// // ============================================
// // SERVICES (JENIS LAYANAN)
// // ============================================

// export const servicesService = {
//   // Get all services
//   async getAll() {
//     try {
//       const { data, error } = await supabase
//         .from("services")
//         .select("*")
//         .eq("is_active", true)
//         .order("created_at");

//       if (error) throw error;
//       return { ok: true, data };
//     } catch (error) {
//       return { ok: false, error: error.message };
//     }
//   },

//   // Get service detail
//   async getDetail(serviceId) {
//     try {
//       const { data, error } = await supabase
//         .from("services")
//         .select("*")
//         .eq("id", serviceId)
//         .single();

//       if (error) throw error;
//       return { ok: true, data };
//     } catch (error) {
//       return { ok: false, error: error.message };
//     }
//   },
// };

// // ============================================
// // TRANSACTIONS SERVICES
// // ============================================

// export const transactionService = {
//   // Record payment
//   async recordPayment(payload) {
//     try {
//       const today = new Date().toISOString().split("T")[0];
//       const transactionCode = `CASH-${today.replace(/-/g, "")}`;

//       const { data, error } = await supabase
//         .from("transactions")
//         .insert({
//           order_id: payload.orderId,
//           transaction_code: transactionCode,
//           payment_method: payload.method || "cash",
//           amount: payload.amount,
//           paid_date: today,
//           recorded_by: payload.recordedBy,
//           notes: payload.notes,
//           status: "confirmed",
//         })
//         .select()
//         .single();

//       if (error) throw error;

//       // Update order payment status
//       await supabase
//         .from("orders")
//         .update({ payment_status: "lunas" })
//         .eq("id", payload.orderId);

//       return { ok: true, data };
//     } catch (error) {
//       return { ok: false, error: error.message };
//     }
//   },

//   // Get order transactions
//   async getByOrder(orderId) {
//     try {
//       const { data, error } = await supabase
//         .from("transactions")
//         .select("*")
//         .eq("order_id", orderId);

//       if (error) throw error;
//       return { ok: true, data };
//     } catch (error) {
//       return { ok: false, error: error.message };
//     }
//   },

//   // Get all transactions
//   async getAll(filters = {}) {
//     try {
//       let query = supabase.from("transactions").select("*, order:orders(*");

//       if (filters.startDate) {
//         query = query.gte("paid_date", filters.startDate);
//       }
//       if (filters.endDate) {
//         query = query.lte("paid_date", filters.endDate);
//       }

//       const { data, error } = await query.order("paid_date", { ascending: false });

//       if (error) throw error;
//       return { ok: true, data };
//     } catch (error) {
//       return { ok: false, error: error.message };
//     }
//   },
// };

// // ============================================
// // DELIVERY PROOFS SERVICES
// // ============================================

// export const deliveryProofService = {
//   // Upload delivery proof
//   async upload(payload) {
//     try {
//       const { data, error } = await supabase
//         .from("delivery_proofs")
//         .insert({
//           order_id: payload.orderId,
//           proof_type: payload.proofType,
//           courier_id: payload.courierId,
//           photo_url: payload.photoUrl,
//           photo_timestamp: new Date().toISOString(),
//           notes: payload.notes,
//           recipient_name: payload.recipientName,
//           latitude: payload.latitude,
//           longitude: payload.longitude,
//         })
//         .select()
//         .single();

//       if (error) throw error;
//       return { ok: true, data };
//     } catch (error) {
//       return { ok: false, error: error.message };
//     }
//   },

//   // Get delivery proofs for order
//   async getByOrder(orderId) {
//     try {
//       const { data, error } = await supabase
//         .from("delivery_proofs")
//         .select("*")
//         .eq("order_id", orderId);

//       if (error) throw error;
//       return { ok: true, data };
//     } catch (error) {
//       return { ok: false, error: error.message };
//     }
//   },

//   // Verify proof (admin)
//   async verify(proofId, verifiedBy) {
//     try {
//       const { error } = await supabase
//         .from("delivery_proofs")
//         .update({
//           status: "verified",
//           verified_by: verifiedBy,
//           verified_at: new Date().toISOString(),
//         })
//         .eq("id", proofId);

//       if (error) throw error;
//       return { ok: true };
//     } catch (error) {
//       return { ok: false, error: error.message };
//     }
//   },
// };

// // ============================================
// // NOTIFICATIONS SERVICES
// // ============================================

// export const notificationService = {
//   // Get user notifications
//   async getByUser(userId) {
//     try {
//       const { data, error } = await supabase
//         .from("notifications")
//         .select("*")
//         .eq("user_id", userId)
//         .order("created_at", { ascending: false });

//       if (error) throw error;
//       return { ok: true, data };
//     } catch (error) {
//       return { ok: false, error: error.message };
//     }
//   },

//   // Mark as read
//   async markRead(notificationId) {
//     try {
//       const { error } = await supabase
//         .from("notifications")
//         .update({
//           is_read: true,
//           read_at: new Date().toISOString(),
//         })
//         .eq("id", notificationId);

//       if (error) throw error;
//       return { ok: true };
//     } catch (error) {
//       return { ok: false, error: error.message };
//     }
//   },

//   // Get unread count
//   async getUnreadCount(userId) {
//     try {
//       const { count, error } = await supabase
//         .from("notifications")
//         .select("*", { count: "exact", head: true })
//         .eq("user_id", userId)
//         .eq("is_read", false);

//       if (error) throw error;
//       return { ok: true, count };
//     } catch (error) {
//       return { ok: false, error: error.message };
//     }
//   },
// };

// // ============================================
// // COURIERS SERVICES
// // ============================================

// export const courierService = {
//   // Get courier profile
//   async getProfile(courierId) {
//     try {
//       const { data, error } = await supabase
//         .from("couriers")
//         .select("*, user:users(*)")
//         .eq("id", courierId)
//         .single();

//       if (error) throw error;
//       return { ok: true, data };
//     } catch (error) {
//       return { ok: false, error: error.message };
//     }
//   },

//   // Get courier tasks
//   async getTasks(courierId, filters = {}) {
//     try {
//       let query = supabase
//         .from("orders")
//         .select("*")
//         .or(`pickup_courier_id.eq.${courierId},delivery_courier_id.eq.${courierId}`);

//       if (filters.status) {
//         query = query.eq("status", filters.status);
//       }

//       const { data, error } = await query.order("created_at", { ascending: false });

//       if (error) throw error;
//       return { ok: true, data };
//     } catch (error) {
//       return { ok: false, error: error.message };
//     }
//   },

//   // Update availability
//   async updateAvailability(courierId, isAvailable) {
//     try {
//       const { error } = await supabase
//         .from("couriers")
//         .update({ is_available: isAvailable })
//         .eq("id", courierId);

//       if (error) throw error;
//       return { ok: true };
//     } catch (error) {
//       return { ok: false, error: error.message };
//     }
//   },
// };

// // Export all services
// export default {
//   authService,
//   customerService,
//   orderService,
//   scheduleService,
//   servicesService,
//   transactionService,
//   deliveryProofService,
//   notificationService,
//   courierService,
// };
