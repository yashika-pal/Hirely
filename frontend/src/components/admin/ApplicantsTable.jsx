import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from '../ui/button';
import { Avatar, AvatarImage } from '../ui/avatar';
import { MoreHorizontal, MessageSquare, Check, X, FileText } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import { APPLICATION_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { setAllApplicants } from "@/redux/applicationSlice";
import MessageContainer from "../user/MessageContainer";

const ApplicantsTable = () => {
  const { applicants } = useSelector((store) => store.application);
  const [selectedApplicantId, setSelectedApplicantId] = useState(null);
  const dispatch = useDispatch();

  const statusHandler = async (status, applicationId) => {
    if (status === "Message") {
      const applicantId = applicants.applications.find(app => app._id === applicationId)?.applicant._id;
      setSelectedApplicantId(applicantId);
      return;
    }

    try {
      const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${applicationId}/update`, { status }, { withCredentials: true });
      if (res.data.success) {
        // Update local state to reflect the change
        const updatedApplications = applicants.applications.map(app =>
          app._id === applicationId ? { ...app, status } : app
        );
        dispatch(setAllApplicants({ ...applicants, applications: updatedApplications }));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Accepted': return 'text-green-600';
      case 'Rejected': return 'text-red-600';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="mt-8">
      <Table>
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead>Applicant</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Applied On</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(applicants?.applications?.length || 0) > 0 ? (
            applicants.applications.map((item) => (
              <TableRow key={item._id} className="hover:bg-gray-50">
                <TableCell className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={item.applicant?.profile?.profilePhoto} alt={item.applicant?.fullname} />
                  </Avatar>
                  <div>
                    <p className="font-semibold">{item.applicant?.fullname}</p>
                    <a className="text-blue-600 cursor-pointer" href={item?.applicant?.profile?.resume} target="_blank" rel="noopener noreferrer">{item?.applicant?.profile?.resumeOriginalName}</a>
                  </div>
                </TableCell>
                <TableCell>
                  <p>{item.applicant?.email}</p>
                  <p className="text-sm text-gray-500">{item.applicant?.phoneNumber}</p>
                </TableCell>
                <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <span className={`font-semibold ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48">
                      <div onClick={() => statusHandler("Message", item._id)} className='flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-md cursor-pointer'>
                        <MessageSquare size={18} /><span>Message</span>
                      </div>
                      <div onClick={() => statusHandler("Accepted", item._id)} className='flex items-center gap-3 px-3 py-2 hover:bg-green-50 text-green-600 rounded-md cursor-pointer mt-1'>
                        <Check size={18} /><span>Accept</span>
                      </div>
                      <div onClick={() => statusHandler("Rejected", item._id)} className='flex items-center gap-3 px-3 py-2 hover:bg-red-50 text-red-600 rounded-md cursor-pointer mt-1'>
                        <X size={18} /><span>Reject</span>
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-10">
                No applicants yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {selectedApplicantId && <MessageContainer recruiterId={selectedApplicantId} onClose={() => setSelectedApplicantId(null)} />}
    </div>
  );
};

export default ApplicantsTable;
