import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import { setSingleCompany } from '@/redux/companySlice'
import { ArrowLeft } from 'lucide-react'

const CompanyCreate = () => {
    const navigate = useNavigate();
    const [companyName, setCompanyName] = useState("");
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const registerNewCompany = async () => {
        setLoading(true);
        try {
            const res = await axios.post(`${COMPANY_API_END_POINT}/register`, { companyName }, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
            if (res?.data?.success) {
                dispatch(setSingleCompany(res.data.company));
                toast.success(res.data.message);
                const companyId = res?.data?.company?._id;
                navigate(`/admin/companies/setup/${companyId}`);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create company.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='bg-gray-50 min-h-screen'>
            <Navbar />
            <div className='max-w-xl mx-auto py-12 px-4 sm:px-6 lg:px-8'>
                <div className="flex items-center gap-4 mb-8">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                        <ArrowLeft />
                    </Button>
                    <h1 className="text-3xl font-bold text-gray-800">Create a New Company</h1>
                </div>

                <div className="bg-white p-8 rounded-lg shadow-md">
                    <div className='space-y-2 mb-6'>
                        <h2 className='font-bold text-2xl'>Let's start with the name</h2>
                    </div>

                    <div className='space-y-2'>
                        <Label htmlFor='companyName' className='text-lg font-medium'>Company Name</Label>
                        <Input
                            id='companyName'
                            type="text"
                            className="py-6 text-lg"
                            placeholder="e.g., Acme Corporation"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                        />
                    </div>

                    <div className='flex items-center justify-end gap-4 mt-8'>
                        <Button variant="outline" onClick={() => navigate("/admin/companies")}>Cancel</Button>
                        <Button onClick={registerNewCompany} disabled={loading || !companyName.trim()}>
                            {loading ? 'Creating...' : 'Continue'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CompanyCreate