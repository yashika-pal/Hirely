import React, { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useParams } from "react-router-dom";
import axios from "axios";
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from "@/utils/constant";
import { setSingleJob } from "@/redux/jobSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import MessageContainer from "./MessageContainer";
import { Briefcase, MapPin, IndianRupee, Calendar, Users, Building } from 'lucide-react';
import Navbar from "../shared/Navbar";

const JobDescription = () => {
  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);
  const isInitiallyApplied = singleJob?.applications?.some((app) => app.applicant === user?._id) || false;
  const [isApplied, setIsApplied] = useState(isInitiallyApplied);
  const [showChat, setShowChat] = useState(false);

  const params = useParams();
  const jobId = params.id;
  const dispatch = useDispatch();

  const applyJobHandler = async () => {
    try {
      const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, { withCredentials: true });
      if (res.data.success) {
        toast.success(res.data.message);
        setIsApplied(true);
        const jobRes = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, { withCredentials: true });
        if (jobRes.data.success) {
          dispatch(setSingleJob(jobRes.data.job));
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to apply.");
    }
  };

  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, { withCredentials: true });
        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
          const applied = res.data.job.applications.some((app) => app.applicant === user?._id);
          setIsApplied(applied);
        }
      } catch (error) {
        console.error(error);
      }
    };
    if (jobId) fetchSingleJob();
  }, [jobId, dispatch, user?._id]);

  if (!singleJob) return <div className="flex justify-center items-center h-screen"><p>Loading...</p></div>;

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="bg-white shadow-md rounded-lg p-8 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start">
              <div className="flex items-start gap-6">
                <img src={singleJob?.company?.logo} alt="Company Logo" className="h-20 w-20 rounded-full" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">{singleJob?.title}</h1>
                  <p className="text-xl text-gray-600 mt-1">{singleJob?.company?.name}</p>
                  <div className="flex items-center gap-2 text-gray-500 mt-2">
                    <MapPin size={16} />
                    <span>{singleJob?.location}</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 md:mt-0 flex flex-col items-end gap-3">
                <Button
                  onClick={isApplied ? undefined : applyJobHandler}
                  disabled={isApplied}
                  className={`w-full md:w-auto rounded-full px-8 py-3 text-lg font-semibold transition-colors ${isApplied ? "bg-green-500 text-white cursor-not-allowed" : "bg-[#6A38C2] text-white hover:bg-[#5b30a6]"
                    }`}
                >
                  {isApplied ? "Applied" : "Apply Now"}
                </Button>
                <Button onClick={() => setShowChat(true)} variant="outline" className="w-full md:w-auto rounded-full px-8 py-3 text-lg">
                  Message Recruiter
                </Button>
              </div>
            </div>
          </div>

          {showChat && <MessageContainer recruiterId={singleJob?.created_by} />}

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white shadow-md rounded-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Job Description</h2>
              <div className="prose max-w-none text-gray-700">
                <p>{singleJob?.description}</p>
              </div>

              <h3 className="text-xl font-bold text-gray-800 mt-8 mb-4">Requirements</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {singleJob?.requirements?.map((req, i) => <li key={i}>{req}</li>) || <li>No requirements specified.</li>}
              </ul>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              <div className="bg-white shadow-md rounded-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Job Overview</h2>
                <ul className="space-y-4 text-gray-700">
                  <li className="flex items-center gap-3"><Briefcase size={20} className="text-[#6A38C2]" /> <span><span className="font-semibold">Job Type:</span> {singleJob?.jobType}</span></li>
                  <li className="flex items-center gap-3"><IndianRupee size={20} className="text-[#6A38C2]" /> <span><span className="font-semibold">Salary:</span> {singleJob?.salary} LPA</span></li>
                  <li className="flex items-center gap-3"><Users size={20} className="text-[#6A38C2]" /> <span><span className="font-semibold">Positions:</span> {singleJob?.position}</span></li>
                  <li className="flex items-center gap-3"><Calendar size={20} className="text-[#6A38C2]" /> <span><span className="font-semibold">Posted:</span> {new Date(singleJob?.createdAt).toLocaleDateString()}</span></li>
                </ul>
              </div>
              <div className="bg-white shadow-md rounded-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">About Company</h2>
                <div className="flex items-center gap-4">
                  <Building size={20} className="text-[#6A38C2]" />
                  <p className="text-lg font-semibold">{singleJob?.company?.name}</p>
                </div>
                <p className="text-gray-700 mt-4">{singleJob?.company?.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default JobDescription;
