import { setAllJobs } from '@/redux/jobSlice'
import { JOB_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const useGetAllJobs = (locations = [], jobTypes = []) => {
    const dispatch = useDispatch();
    const { searchedQuery } = useSelector(store => store.job);
    useEffect(() => {
        const fetchAllJobs = async () => {
            try {
                let url = `${JOB_API_END_POINT}/get?keyword=${searchedQuery}`;
                locations.forEach(loc => { url += `&location=${encodeURIComponent(loc)}`; });
                jobTypes.forEach(jt => { url += `&jobType=${encodeURIComponent(jt)}`; });
                const res = await axios.get(url, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setAllJobs(res.data.jobs));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllJobs();
    }, [searchedQuery, locations, jobTypes])
}

export default useGetAllJobs