import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useSelector } from 'react-redux'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Textarea } from '../ui/textarea'
import axios from 'axios'
import { JOB_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { Loader2, ArrowLeft } from 'lucide-react'

const PostJob = () => {
    const [input, setInput] = useState({
        title: "",
        description: "",
        requirements: "",
        salary: "",
        location: "",
        jobType: "",
        experience: "",
        position: "",
        companyId: ""
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { companies } = useSelector(store => store.company);

    const changeEventHandler = (e) => {
        const { name, value } = e.target;
        setInput({ ...input, [name]: value });
    };

    const handleSelectChange = (name, value) => {
        setInput({ ...input, [name]: value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post(`${JOB_API_END_POINT}/post`, input, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/admin/jobs");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to post job.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <Navbar />
            <div className='max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8'>
                <div className="flex items-center gap-4 mb-8">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                        <ArrowLeft />
                    </Button>
                    <h1 className="text-3xl font-bold text-gray-800">Post a New Job</h1>
                </div>

                <form onSubmit={submitHandler} className='p-8 bg-white rounded-lg shadow-md space-y-8'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                        <div>
                            <Label>Title</Label>
                            <Input name="title" value={input.title} onChange={changeEventHandler} placeholder="e.g. Software Engineer" />
                        </div>
                        <div>
                            <Label>Location</Label>
                            <Input name="location" value={input.location} onChange={changeEventHandler} placeholder="e.g. Delhi" />
                        </div>
                        <div>
                            <Label>Job Type</Label>
                            <Select name="jobType" onValueChange={(value) => handleSelectChange('jobType', value)}>
                                <SelectTrigger><SelectValue placeholder="Select job type" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Full-time">Full-time</SelectItem>
                                    <SelectItem value="Part-time">Part-time</SelectItem>
                                    <SelectItem value="Contract">Contract</SelectItem>
                                    <SelectItem value="Internship">Internship</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Experience Level (years)</Label>
                            <Input name="experience" type="number" value={input.experience} onChange={changeEventHandler} placeholder="e.g. 2" />
                        </div>
                        <div>
                            <Label>Salary (LPA)</Label>
                            <Input name="salary" value={input.salary} onChange={changeEventHandler} placeholder="e.g. 10" />
                        </div>
                        <div>
                            <Label>Open Positions</Label>
                            <Input name="position" type="number" value={input.position} onChange={changeEventHandler} placeholder="e.g. 5" />
                        </div>
                        <div className="md:col-span-2">
                            <Label>Company</Label>
                            <Select name="companyId" onValueChange={(value) => handleSelectChange('companyId', value)} disabled={companies.length === 0}>
                                <SelectTrigger><SelectValue placeholder="Select a company" /></SelectTrigger>
                                <SelectContent>
                                    {companies.map(comp => <SelectItem key={comp._id} value={comp._id}>{comp.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            {companies.length === 0 && <p className='text-xs text-red-600 font-medium mt-2'>*Please register a company first.</p>}
                        </div>
                        <div className="md:col-span-2">
                            <Label>Description</Label>
                            <Textarea name="description" value={input.description} onChange={changeEventHandler} placeholder="Describe the job role..." />
                        </div>
                        <div className="md:col-span-2">
                            <Label>Requirements</Label>
                            <Textarea name="requirements" value={input.requirements} onChange={changeEventHandler} placeholder="List job requirements, separated by new lines..." />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" className="px-8" disabled={loading}>
                            {loading ? <><Loader2 className='mr-2 h-4 w-4 animate-spin' /> Posting...</> : "Post Job"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default PostJob