"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  IconFilter, 
  IconArrowsSort, 
  IconMapPin, 
  IconChevronRight,
  IconX
} from "@tabler/icons-react";

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
  { value: "hot", label: "Hot", icon: "🔥" },
  { value: "top", label: "Top", icon: "⭐" },
  { value: "new", label: "New", icon: "🆕" },
  { value: "controversial", label: "Controversial", icon: "💭" }
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

  const clearFilters = () => {
    setSelectedDivision("");
    setSelectedDistrict("");
    setSortBy("hot");
    onFilterChange({
      division: "",
      district: "",
      sortBy: "hot"
    });
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IconFilter className="w-5 h-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Filters</h2>
        </div>
        {(selectedDivision || selectedDistrict || sortBy !== "hot") && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <IconX className="w-4 h-4 mr-1" />
            Clear Filters
          </Button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Division Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <IconMapPin className="w-4 h-4" />
              {selectedDivision || "All Divisions"}
              <IconChevronRight className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>Select Division</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-[300px] overflow-y-auto">
              <DropdownMenuItem onClick={() => handleDivisionChange("")}>
                All Divisions
              </DropdownMenuItem>
              {Object.keys(divisions).map((division) => (
                <DropdownMenuItem
                  key={division}
                  onClick={() => handleDivisionChange(division)}
                  className="flex items-center justify-between"
                >
                  {division}
                  {selectedDivision === division && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2 h-2 rounded-full bg-primary"
                    />
                  )}
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* District Filter */}
        {selectedDivision && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <IconMapPin className="w-4 h-4" />
                {selectedDistrict || "All Districts"}
                <IconChevronRight className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Select District</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-[300px] overflow-y-auto">
                <DropdownMenuItem onClick={() => handleDistrictChange("")}>
                  All Districts
                </DropdownMenuItem>
                {divisions[selectedDivision].map((district) => (
                  <DropdownMenuItem
                    key={district}
                    onClick={() => handleDistrictChange(district)}
                    className="flex items-center justify-between"
                  >
                    {district}
                    {selectedDistrict === district && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 rounded-full bg-primary"
                      />
                    )}
                  </DropdownMenuItem>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Sort Options */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 ml-auto">
              <IconArrowsSort className="w-4 h-4" />
              {sortOptions.find(opt => opt.value === sortBy)?.label}
              <IconChevronRight className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Sort Posts</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={sortBy} onValueChange={handleSortChange}>
              {sortOptions.map((option) => (
                <DropdownMenuRadioItem 
                  key={option.value} 
                  value={option.value}
                  className="flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <span>{option.icon}</span>
                    {option.label}
                  </span>
                  {sortBy === option.value && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2 h-2 rounded-full bg-primary"
                    />
                  )}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Active Filters */}
        <AnimatePresence>
          {(selectedDivision || selectedDistrict) && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2"
            >
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-2">
                {selectedDivision && (
                  <Badge variant="secondary" className="gap-1">
                    {selectedDivision}
                    <button 
                      onClick={() => handleDivisionChange("")}
                      className="ml-1 hover:text-destructive"
                    >
                      <IconX className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {selectedDistrict && (
                  <Badge variant="secondary" className="gap-1">
                    {selectedDistrict}
                    <button 
                      onClick={() => handleDistrictChange("")}
                      className="ml-1 hover:text-destructive"
                    >
                      <IconX className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default PostFilters; 