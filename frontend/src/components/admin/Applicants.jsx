import React, { useEffect } from 'react'
import Navbar from '../shared/Navbar'
import ApplicantsTable from './ApplicantsTable'
import axios from 'axios';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAllApplicants } from '@/redux/applicationSlice';
import { Button } from '../ui/button';
import { ArrowLeft } from 'lucide-react';

const Applicants = () => {
    const params = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { applicants } = useSelector(store => store.application);

    useEffect(() => {
        const fetchAllApplicants = async () => {
            try {
                const res = await axios.get(`${APPLICATION_API_END_POINT}/${params.id}/applicants`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setAllApplicants(res.data.job));
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchAllApplicants();

        return () => {
            dispatch(setAllApplicants(null));
        }
    }, [params.id, dispatch]);
    return (
        <div className="bg-gray-50 min-h-screen">
            <Navbar />
            <div className='max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8'>
                <div className="bg-white p-8 rounded-lg shadow-md">
                    <div className="flex items-center gap-4 mb-8">
                        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                            <ArrowLeft />
                        </Button>
                        <div>
                            <h1 className='text-3xl font-bold text-gray-800'>
                                Applicants for {applicants?.title}
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Total Applicants: {applicants?.applications?.length || 0}
                            </p>
                        </div>
                    </div>
                    <ApplicantsTable />
                </div>
            </div>
        </div>
    )
}

export default Applicants