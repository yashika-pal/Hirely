import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '@/redux/authSlice'
import { Loader2 } from 'lucide-react'

const Signup = () => {
    const [input, setInput] = useState({
        fullname: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "student",
        file: null
    });
    const { loading, user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const changeFileHandler = (e) => {
        if (e.target.files) {
            setInput({ ...input, file: e.target.files[0] });
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("password", input.password);
        formData.append("role", input.role);
        if (input.file) {
            formData.append("file", input.file);
        }

        dispatch(setLoading(true));
        try {
            const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true,
            });
            if (res.data.success) {
                navigate("/login");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Signup failed.");
        } finally {
            dispatch(setLoading(false));
        }
    };

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-lg space-y-8">
                    <div className="text-center">
                        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                            Create an account
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Or{' '}
                            <Link to="/login" className="font-medium text-[#6A38C2] hover:text-[#5b30a6]">
                                sign in to your existing account
                            </Link>
                        </p>
                    </div>
                    <form onSubmit={submitHandler} className="mt-8 space-y-6 bg-white p-8 shadow-md rounded-lg">
                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                <Label htmlFor="fullname">Full Name</Label>
                                <Input id="fullname" name="fullname" type="text" required value={input.fullname} onChange={changeEventHandler} className="mt-1" placeholder="Your name" />
                            </div>
                            <div className="sm:col-span-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input id="email" name="email" type="email" required value={input.email} onChange={changeEventHandler} className="mt-1" placeholder="you@example.com" />
                            </div>
                            <div>
                                <Label htmlFor="phoneNumber">Phone Number</Label>
                                <Input id="phoneNumber" name="phoneNumber" type="tel" required value={input.phoneNumber} onChange={changeEventHandler} className="mt-1" placeholder="123-456-7890" />
                            </div>
                            <div>
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" name="password" type="password" required value={input.password} onChange={changeEventHandler} className="mt-1" placeholder="********" />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <p className="font-medium">I am a:</p>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center">
                                    <input id="role-student-signup" name="role" type="radio" value="student" checked={input.role === 'student'} onChange={changeEventHandler} className="h-4 w-4 text-[#6A38C2] focus:ring-[#5b30a6] border-gray-300" />
                                    <Label htmlFor="role-student-signup" className="ml-2 block text-sm text-gray-900">Student</Label>
                                </div>
                                <div className="flex items-center">
                                    <input id="role-recruiter-signup" name="role" type="radio" value="recruiter" checked={input.role === 'recruiter'} onChange={changeEventHandler} className="h-4 w-4 text-[#6A38C2] focus:ring-[#5b30a6] border-gray-300" />
                                    <Label htmlFor="role-recruiter-signup" className="ml-2 block text-sm text-gray-900">Recruiter</Label>
                                </div>
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="profile-picture">Profile Picture</Label>
                            <Input id="profile-picture" name="file" type="file" onChange={changeFileHandler} className="mt-1 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-[#6A38C2] hover:file:bg-violet-100" />
                        </div>

                        <div>
                            <Button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#6A38C2] hover:bg-[#5b30a6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5b30a6]" disabled={loading}>
                                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait</> : "Create Account"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Signup