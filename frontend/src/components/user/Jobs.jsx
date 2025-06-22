import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import FilterCard from "./FilterCard";
import Job from "./Job";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { RingLoader } from "react-spinners";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import { useNavigate, Navigate } from "react-router-dom";

const Jobs = () => {
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const { allJobs } = useSelector((store) => store.job);
  const [filters, setFilters] = useState({ locations: [], jobTypes: [] });
  const [loading, setLoading] = useState(true);

  useGetAllJobs(filters.locations, filters.jobTypes);

  useEffect(() => {
    setLoading(!allJobs);
  }, [allJobs]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto mt-6 p-2 sm:mt-10 sm:p-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-8">
          Browse Jobs
        </h1>
        <div className="flex flex-col md:flex-row gap-4 md:gap-8">
          <div className="w-full md:w-1/4 order-2 md:order-1">
            <FilterCard onFilterChange={setFilters} />
          </div>
          <div className="flex-1 order-1 md:order-2">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <RingLoader color="#6A38C2" size={80} />
              </div>
            ) : allJobs.length <= 0 ? (
              <div className="text-center py-10">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-700">
                  No Jobs Found
                </h2>
                <p className="text-gray-500 mt-2">
                  Try logging in or wait for recruiter to PostJob
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {allJobs.map((job) => (
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.5 }}
                    key={job?._id}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
                  >
                    <Job job={job} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
