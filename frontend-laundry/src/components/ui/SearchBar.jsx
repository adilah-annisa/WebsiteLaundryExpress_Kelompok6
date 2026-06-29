import { IoSearchOutline } from "react-icons/io5";
import Input from "./Input";

export default function SearchBar({ value, onChange, placeholder = "Cari...", className = "" }) {
  const handleSearch = (e) => onChange?.(e.target.value);

  return (
    <Input
      value={value}
      onChange={handleSearch}
      placeholder={placeholder}
      icon={IoSearchOutline}
      containerClassName={className}
    />
  );
}
