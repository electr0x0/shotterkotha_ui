"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  IconFilter, 
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

function PostFilters({ onFilterChange }) {
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  const handleDivisionChange = (division) => {
    setSelectedDivision(division);
    setSelectedDistrict(""); // Reset district when division changes
    onFilterChange({
      division,
      district: ""
    });
  };

  const handleDistrictChange = (district) => {
    setSelectedDistrict(district);
    onFilterChange({
      division: selectedDivision,
      district
    });
  };

  const clearFilters = () => {
    setSelectedDivision("");
    setSelectedDistrict("");
    onFilterChange({
      division: "",
      district: ""
    });
  };

  return (
    <div className="relative bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="flex items-center gap-2 p-4">
        <div className="flex items-center gap-2">
          <IconFilter className="w-5 h-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Filters</h2>
        </div>
        {(selectedDivision || selectedDistrict) && (
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

        {/* Division Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <IconMapPin className="h-4 w-4" />
              {selectedDivision || "All Divisions"}
              <IconChevronRight className="h-4 w-4" />
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

        {/* District Dropdown - Only show if division is selected */}
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
      </div>
    </div>
  );
}

export default PostFilters; 