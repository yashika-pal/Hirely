import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Avatar, AvatarImage } from '../ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Edit2, Eye, MoreHorizontal, Trash2 } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { JOB_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { setAllAdminJobs } from '@/redux/jobSlice'

const AdminJobsTable = () => {
    const { allAdminJobs, searchJobByText } = useSelector(store => store.job);
    const [filteredJobs, setFilteredJobs] = useState(allAdminJobs || []);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const deleteJobHandler = async (jobId) => {
        try {
            const res = await axios.delete(`${JOB_API_END_POINT}/delete/${jobId}`, { withCredentials: true });
            if (res.data.success) {
                toast.success(res.data.message);
                dispatch(setAllAdminJobs(allAdminJobs.filter(job => job._id !== jobId)));
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete job.');
        }
    };

    useEffect(() => {
        console.log('called');
        const filteredJobs = allAdminJobs.filter((job) => {
            if (!searchJobByText) {
                return true;
            };
            return job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) || job?.company?.name.toLowerCase().includes(searchJobByText.toLowerCase());

        });
        setFilteredJobs(filteredJobs);
    }, [allAdminJobs, searchJobByText])
    return (
        <div className="mt-8">
            <Table>
                <TableHeader className="bg-gray-100">
                    <TableRow>
                        <TableHead>Company</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Date Posted</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredJobs.length > 0 ? (
                        filteredJobs.map((job) => (
                            <TableRow key={job._id} className="hover:bg-gray-50">
                                <TableCell className="flex items-center gap-4">
                                    <Avatar>
                                        <AvatarImage src={job?.company?.logo} alt={job?.company?.name} />
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold">{job?.company?.name}</p>
                                        <p className="text-sm text-gray-500">{job?.location}</p>
                                    </div>
                                </TableCell>
                                <TableCell>{job?.title}</TableCell>
                                <TableCell>{new Date(job?.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell className="text-right">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="h-5 w-5" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-40">
                                            <div
                                                onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                                                className='flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-md cursor-pointer'
                                            >
                                                <Eye size={18} />
                                                <span>Applicants</span>
                                            </div>
                                            <div
                                                onClick={() => deleteJobHandler(job._id)}
                                                className='flex items-center gap-3 px-3 py-2 hover:bg-red-50 text-red-600 rounded-md cursor-pointer mt-1'
                                            >
                                                <Trash2 size={18} />
                                                <span>Delete</span>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center py-10">
                                No jobs found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

export default AdminJobsTable