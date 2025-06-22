import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Button } from '../ui/button'
import { ArrowLeft, Loader2, Image as ImageIcon } from 'lucide-react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import axios from 'axios'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useSelector, useDispatch } from 'react-redux'
import useGetCompanyById from '@/hooks/useGetCompanyById'
import { setSingleCompany } from '@/redux/companySlice'

const CompanySetup = () => {
    const params = useParams();
    useGetCompanyById(params.id);

    const { singleCompany } = useSelector(store => store.company);
    const [input, setInput] = useState({
        name: "",
        description: "",
        website: "",
        location: "",
        file: null
    });
    const [logoPreview, setLogoPreview] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const changeFileHandler = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setInput({ ...input, file });
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append("name", input.name);
        formData.append("description", input.description);
        formData.append("website", input.website);
        formData.append("location", input.location);
        if (input.file) {
            formData.append("file", input.file);
        }

        try {
            const res = await axios.put(`${COMPANY_API_END_POINT}/update/${params.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/admin/companies");
                dispatch(setSingleCompany(null));
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update company.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (singleCompany) {
            setInput({
                name: singleCompany.name || "",
                description: singleCompany.description || "",
                website: singleCompany.website || "",
                location: singleCompany.location || "",
                file: null
            });
            setLogoPreview(singleCompany.logo || "");
        }
    }, [singleCompany]);

    return (
        <div className='bg-gray-50 min-h-screen'>
            <Navbar />
            <div className='max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8'>
                <div className="flex items-center gap-4 mb-8">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/admin/companies")}>
                        <ArrowLeft />
                    </Button>
                    <h1 className="text-3xl font-bold text-gray-800">Company Setup</h1>
                </div>

                <form onSubmit={submitHandler} className='p-8 bg-white rounded-lg shadow-md space-y-8'>
                    <div className="flex flex-col md:flex-row items-start gap-8">
                        <div className="md:w-1/3 flex flex-col items-center">
                            <Label htmlFor="logo-upload" className="cursor-pointer">
                                {logoPreview ? (
                                    <img src={logoPreview} alt="Logo" className="h-40 w-40 rounded-full object-cover border-4 border-gray-200" />
                                ) : (
                                    <div className="h-40 w-40 rounded-full bg-gray-100 flex items-center justify-center border-4 border-dashed">
                                        <ImageIcon size={40} className="text-gray-400" />
                                    </div>
                                )}
                            </Label>
                            <Input id="logo-upload" type="file" accept="image/*" onChange={changeFileHandler} className="hidden" />
                            <p className="text-sm text-gray-500 mt-2">Upload Logo</p>
                        </div>

                        <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <Label>Company Name</Label>
                                <Input name="name" value={input.name} onChange={changeEventHandler} />
                            </div>
                            <div>
                                <Label>Website</Label>
                                <Input name="website" value={input.website} onChange={changeEventHandler} placeholder="https://example.com" />
                            </div>
                            <div>
                                <Label>Location</Label>
                                <Input name="location" value={input.location} onChange={changeEventHandler} placeholder="e.g. Bangalore, India" />
                            </div>
                            <div className="md:col-span-2">
                                <Label>Description</Label>
                                <Textarea name="description" value={input.description} onChange={changeEventHandler} placeholder="About your company..." />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" className="px-8" disabled={loading}>
                            {loading ? <><Loader2 className='mr-2 h-4 w-4 animate-spin' /> Saving...</> : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CompanySetup