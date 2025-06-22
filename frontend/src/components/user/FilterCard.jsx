import React, { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import { Button } from "../ui/button";

const filterData = [
  {
    filterType: "Location",
    array: ["Delhi", "Bangalore", "Hyderabad", "Pune", "Mumbai", "Remote"],
  },

];

const FilterCard = ({ onFilterChange }) => {
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedJobTypes, setSelectedJobTypes] = useState([]);

  const handleLocationChange = (value) => {
    setSelectedLocations((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleJobTypeChange = (value) => {
    setSelectedJobTypes((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  useEffect(() => {
    onFilterChange({ locations: selectedLocations, jobTypes: selectedJobTypes });
  }, [selectedLocations, selectedJobTypes, onFilterChange]);

  const clearFilterHandler = () => {
    setSelectedLocations([]);
    setSelectedJobTypes([]);
    onFilterChange({ locations: [], jobTypes: [] });
  };

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-bold text-xl text-gray-800">Filter Jobs</h1>
        <Button variant="ghost" className="text-sm text-[#6A38C2] hover:bg-purple-50" onClick={clearFilterHandler}>Clear All</Button>
      </div>
      <hr className="mb-6" />
      <div className="mb-6">
        <h1 className="font-semibold text-lg text-gray-700 mb-3">Location</h1>
        {["Delhi", "Bangalore", "Hyderabad", "Pune", "Mumbai", "Remote"].map((item) => (
          <div key={item} className="flex items-center space-x-3 my-2">
            <input
              type="checkbox"
              id={`Location-${item}`}
              checked={selectedLocations.includes(item)}
              onChange={() => handleLocationChange(item)}
            />
            <Label htmlFor={`Location-${item}`} className="text-gray-600 cursor-pointer">{item}</Label>
          </div>
        ))}
      </div>
      <div className="mb-6">
        <h1 className="font-semibold text-lg text-gray-700 mb-3">Job Type</h1>
        {["Full-time", "Part-time", "Contract", "Internship"].map((item) => (
          <div key={item} className="flex items-center space-x-3 my-2">
            <input
              type="checkbox"
              id={`JobType-${item}`}
              checked={selectedJobTypes.includes(item)}
              onChange={() => handleJobTypeChange(item)}
            />
            <Label htmlFor={`JobType-${item}`} className="text-gray-600 cursor-pointer">{item}</Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterCard;
