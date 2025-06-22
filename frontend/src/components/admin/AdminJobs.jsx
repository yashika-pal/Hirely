import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import AdminJobsTable from './AdminJobsTable'
import useGetAllAdminJobs from '@/hooks/useGetAllAdminJobs'
import { setSearchJobByText } from '@/redux/jobSlice'
import { PlusCircle } from 'lucide-react'

const AdminJobs = () => {
  useGetAllAdminJobs();
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchJobByText(input));
  }, [input, dispatch]);

  return (
    <div className='bg-gray-50 min-h-screen'>
      <Navbar />
      <div className='max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8'>
        <div className='bg-white shadow-md rounded-lg p-8'>
          <div className='flex flex-col sm:flex-row justify-between items-center mb-8'>
            <h1 className='text-3xl font-bold text-gray-800'>Manage Jobs</h1>
            <div className='flex items-center gap-4 mt-4 sm:mt-0'>
              <Input
                className="w-full sm:w-64"
                placeholder="Filter by title, role..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <Button onClick={() => navigate("/admin/jobs/create")} className='flex items-center gap-2'>
                <PlusCircle size={20} />
                New Job
              </Button>
            </div>
          </div>
          <AdminJobsTable />
        </div>
      </div>
    </div>
  )
}

export default AdminJobs