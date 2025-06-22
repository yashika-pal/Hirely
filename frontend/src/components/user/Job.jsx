import React from "react";
import { Button } from "../ui/button";
import { Bookmark, Briefcase, MapPin, IndianRupee } from "lucide-react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { useNavigate } from "react-router-dom";

const Job = ({ job }) => {
  const navigate = useNavigate();

  const daysAgoFunction = (mongodbTime) => {
    const createdAt = new Date(mongodbTime);
    const currentTime = new Date();
    const timeDifference = currentTime - createdAt;
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    return days === 0 ? "Today" : `${days} days ago`;
  };

  return (
    <div
      className="p-6 rounded-lg shadow-sm bg-white border border-gray-200 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={() => navigate(`/description/${job?._id}`)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={job?.company?.logo} alt={job?.company?.name} />
          </Avatar>
          <div>
            <h1 className="text-xl font-semibold text-gray-800">{job?.title}</h1>
            <p className="text-md text-gray-600">{job?.company?.name}</p>
            <p className="text-sm text-gray-500 mt-1">{job?.location}</p>
          </div>
        </div>
        <p className="text-sm text-gray-500">{daysAgoFunction(job?.createdAt)}</p>
      </div>

      <div className="my-4">
        <p className="text-sm text-gray-700 leading-relaxed">
          {job?.description.substring(0, 150)}...
        </p>
      </div>

      <div className="flex items-center gap-3 mt-4 flex-wrap">
        <Badge variant="outline" className="flex items-center gap-2">
          <Briefcase size={16} />
          <span>{job?.jobType}</span>
        </Badge>
        <Badge variant="outline" className="flex items-center gap-2">
          <IndianRupee size={16} />
          <span>{job?.salary} LPA</span>
        </Badge>
        <Badge variant="outline" className="flex items-center gap-2">
          <MapPin size={16} />
          <span>{job?.location}</span>
        </Badge>
      </div>

      <div className="flex items-center justify-end gap-4 mt-6">
        <Button variant="outline" className="border-[#6A38C2] text-[#6A38C2] hover:bg-purple-50">
          View Details
        </Button>
      </div>
    </div>
  );
};

export default Job;
