import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Avatar, AvatarImage } from '../ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Edit2, MoreHorizontal, Trash2 } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { setCompanies } from '@/redux/companySlice'

const CompaniesTable = () => {
    const { companies, searchCompanyByText } = useSelector(store => store.company);
    const [filteredCompanies, setFilteredCompanies] = useState(companies || []);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const deleteCompanyHandler = async (companyId) => {
        try {
            const res = await axios.delete(`${COMPANY_API_END_POINT}/delete/${companyId}`, { withCredentials: true });
            if (res.data.success) {
                toast.success(res.data.message);
                dispatch(setCompanies(companies.filter(comp => comp._id !== companyId)));
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete company.');
        }
    };

    useEffect(() => {
        const filtered = (companies || []).filter((company) => {
            if (!searchCompanyByText) return true;
            return company?.name?.toLowerCase().includes(searchCompanyByText.toLowerCase());
        });
        setFilteredCompanies(filtered);
    }, [companies, searchCompanyByText]);

    return (
        <div className="mt-8">
            <Table>
                <TableHeader className="bg-gray-100">
                    <TableRow>
                        <TableHead>Company</TableHead>
                        <TableHead>Date Joined</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredCompanies.length > 0 ? (
                        filteredCompanies.map((company) => (
                            <TableRow key={company._id} className="hover:bg-gray-50">
                                <TableCell className="flex items-center gap-4">
                                    <Avatar>
                                        <AvatarImage src={company.logo} alt={company.name} />
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold">{company.name}</p>
                                        <p className="text-sm text-gray-500">{company.website}</p>
                                    </div>
                                </TableCell>
                                <TableCell>{new Date(company.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell className="text-right">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="h-5 w-5" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-40">
                                            <div
                                                onClick={() => navigate(`/admin/companies/setup/${company._id}`)}
                                                className='flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-md cursor-pointer'
                                            >
                                                <Edit2 size={18} />
                                                <span>Edit</span>
                                            </div>
                                            <div
                                                onClick={() => deleteCompanyHandler(company._id)}
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
                            <TableCell colSpan={3} className="text-center py-10">
                                No companies found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

export default CompaniesTable