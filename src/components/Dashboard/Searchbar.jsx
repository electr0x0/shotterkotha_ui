"use client";
import { useState } from "react"
import { IconSearch } from "@tabler/icons-react"
import { Input } from "@/components/ui/input"

export default function Searchbar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("")

  const handleSearch = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    onSearch(value)
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative flex items-center">
        <IconSearch className="absolute left-3 w-5 h-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search posts..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full py-2 pl-10 pr-4 text-sm bg-secondary rounded-full focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
        />
      </div>
    </div>
  )
}