import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Contact, Mail, Pen, Briefcase, FileText } from "lucide-react";
import { Badge } from "../ui/badge";
import { Label } from "../ui/label";
import AppliedJobTable from "./AppliedJobTable";
import UpdateProfileDialog from "./UpdateProfileDialog";
import { useSelector } from "react-redux";
import useGetAppliedJobs from "@/hooks/useGetAppliedJobs";

const isResume = true;

const Profile = () => {
  useGetAppliedJobs();
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);


  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto py-6 px-2 sm:py-12 sm:px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
          {/* Profile Card */}
          <div className="md:col-span-1 mb-4 md:mb-0">
            <div className="bg-white p-4 sm:p-8 rounded-lg shadow-md">
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 sm:h-32 sm:w-32">
                  <AvatarImage src={user?.profile?.profilePhoto} alt="profile" />
                </Avatar>
                <h1 className="mt-4 sm:mt-6 text-xl sm:text-2xl font-bold text-gray-800">{user?.fullname}</h1>
                <p className="mt-2 text-center text-gray-600">{user?.profile?.bio}</p>
                <Button
                  onClick={() => setOpen(true)}
                  className="mt-4 sm:mt-6 w-full"
                  variant="outline"
                >
                  <Pen className="mr-2 h-4 w-4" /> Edit Profile
                </Button>
              </div>
              <div className="mt-6 sm:mt-8 border-t border-gray-200 pt-4 sm:pt-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-2 sm:mb-4">Contact Info</h2>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center gap-2 sm:gap-3 text-gray-600">
                    <Mail size={18} />
                    <span className="text-sm sm:text-base">{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 text-gray-600">
                    <Contact size={18} />
                    <span className="text-sm sm:text-base">{user?.phoneNumber}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Main Content */}
          <div className="md:col-span-2 space-y-4 sm:space-y-8">
            <div className="bg-white p-4 sm:p-8 rounded-lg shadow-md">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">Skills</h2>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                {user?.profile?.skills?.length > 0 ? (
                  user.profile.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-md px-3 py-1 sm:px-4 sm:py-2">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <p className="text-gray-500">No skills added yet.</p>
                )}
              </div>
            </div>
            <div className="bg-white p-4 sm:p-8 rounded-lg shadow-md">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">Resume</h2>
              {user?.profile?.resume ? (
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
                  <FileText size={22} className="text-gray-500" />
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={user?.profile?.resume}
                    className="text-blue-600 hover:underline font-medium text-sm sm:text-base"
                  >
                    {user?.profile?.resumeOriginalName || 'View Resume'}
                  </a>
                </div>
              ) : (
                <p className="text-gray-500">No resume uploaded.</p>
              )}
            </div>
            <div className="bg-white p-4 sm:p-8 rounded-lg shadow-md overflow-x-auto">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                <Briefcase size={20} />
                Applied Jobs
              </h2>
              <AppliedJobTable />
            </div>
          </div>
        </div>
      </div>
      <UpdateProfileDialog open={open} setOpen={setOpen} />
    </div>
  );
};

export default Profile;
