"use client";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { IconFilter, IconArrowsSort } from "@tabler/icons-react";

const divisions = {
  "Dhaka": ["Dhaka", "Gazipur", "Narayanganj", "Tangail"],
  "Chittagong": ["Chittagong", "Cox's Bazar", "Bandarban", "Rangamati"],
  "Sylhet": ["Sylhet", "Sunamganj", "Moulvibazar", "Habiganj"],
  "Rajshahi": ["Rajshahi", "Bogra", "Pabna", "Sirajganj"],
  "Khulna": ["Khulna", "Jessore", "Satkhira", "Bagerhat"],
  "Barisal": ["Barisal", "Bhola", "Patuakhali", "Pirojpur"],
  "Rangpur": ["Rangpur", "Dinajpur", "Kurigram", "Gaibandha"],
  "Mymensingh": ["Mymensingh", "Jamalpur", "Netrokona", "Sherpur"]
};

const sortOptions = [
  { value: "hot", label: "Hot" },
  { value: "top", label: "Top" },
  { value: "new", label: "New" },
  { value: "controversial", label: "Controversial" }
];

function PostFilters({ onFilterChange }) {
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [sortBy, setSortBy] = useState("hot");

  const handleDivisionChange = (division) => {
    setSelectedDivision(division);
    setSelectedDistrict(""); // Reset district when division changes
    onFilterChange({
      division,
      district: "",
      sortBy
    });
  };

  const handleDistrictChange = (district) => {
    setSelectedDistrict(district);
    onFilterChange({
      division: selectedDivision,
      district,
      sortBy
    });
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    onFilterChange({
      division: selectedDivision,
      district: selectedDistrict,
      sortBy: sort
    });
  };

  return (
    <div className="flex items-center gap-2 mb-6">
      {/* Division Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md border hover:bg-accent">
          <IconFilter className="w-4 h-4" />
          {selectedDivision || "All Divisions"}
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Select Division</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleDivisionChange("")}>
            All Divisions
          </DropdownMenuItem>
          {Object.keys(divisions).map((division) => (
            <DropdownMenuItem
              key={division}
              onClick={() => handleDivisionChange(division)}
            >
              {division}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* District Filter (Only shown if division is selected) */}
      {selectedDivision && (
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md border hover:bg-accent">
            <IconFilter className="w-4 h-4" />
            {selectedDistrict || "All Districts"}
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Select District</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleDistrictChange("")}>
              All Districts
            </DropdownMenuItem>
            {divisions[selectedDivision].map((district) => (
              <DropdownMenuItem
                key={district}
                onClick={() => handleDistrictChange(district)}
              >
                {district}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Sort Options */}
      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md border hover:bg-accent ml-auto">
          <IconArrowsSort className="w-4 h-4" />
          Sort by: {sortOptions.find(opt => opt.value === sortBy)?.label}
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Sort Posts</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={sortBy} onValueChange={handleSortChange}>
            {sortOptions.map((option) => (
              <DropdownMenuRadioItem key={option.value} value={option.value}>
                {option.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default PostFilters; 