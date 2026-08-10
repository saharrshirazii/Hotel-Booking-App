import React, { useState , useEffect } from 'react'
import Title from '../../Components/Title'
import { assets, dashboardDummyData } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'

const Dashboard = () => {
    // const [dashboardData, setDashboardData] = useState(dashboardDummyData)
    const [dashboardData, setDashboardData] = useState({
        bookings: [],
        totalBookings: 0,
        totalRevenue: 0,
    });

    const {axios , getToken , user, currency , toast} = useAppContext(); //get the axios instance and getToken function from the context to make API calls with authentication

    //Fetch Dashboard Data  
    const fetchDashboardData = async () => {
        try {
            const { data } = await axios.get('/api/bookings/dashboard', { headers: { Authorization: `Bearer ${await getToken()}` } }); //send a GET request to the backend API to fetch the dashboard data of the hotel owner with auth token in the header
            if(data.success){
                setDashboardData(data.dashboardData); //save the fetched dashboard data in the state
            }else{
                toast.error(data.message); //show error message if the API call fails
            }
        } catch (error) {
            toast.error(error.message); //show error message if the API call fails
        }
    }

    useEffect(() => {
        if(user){
            fetchDashboardData(); //fetch the dashboard data when the component mounts and when the user state changes (i.e. when the user logs in or out)
        }
    }, [user]);

    return (
        <div>
            <Title align='left' font='outfit' title='Dashboard' subTitle='Monitor your room listings, track bookings and analyze revenue-all in one place. Stay updated with real-time
        insights to ensure smooth operations.'/>

            <div className='flex gap-4 my-8'>
                {/* Total Bookings */}
                <div className='bg-primary/3 border border-primary/10 rounded flex p-4 pr-8'>
                    <img src={assets.totalBookingIcon} alt='' className='max-sm:hidden h-10' />
                    <div className='flex flex-col sm:ml-4 font-medium'>
                        <p className='text-blue-500 text-lg'>Total Bookings</p>
                        <p className='text-neutral-400 text-base'>{dashboardData.totalBookings}</p>
                    </div>
                </div>

                {/* Total Revenue */}
                <div className='bg-primary/3 border border-primary/10 rounded flex p-4 pr-8'>
                    <img src={assets.totalRevenueIcon} alt='' className='max-sm:hidden h-10' />
                    <div className='flex flex-col sm:ml-4 font-medium'>
                        <p className='text-blue-500 text-lg'>Total Revenues</p>
                        <p className='text-neutral-400 text-base'>{currency} {dashboardData.totalRevenue}</p>
                    </div>
                </div>
            </div>

            {/* Recent Bookings */}
            <h2 className='text-xl text-blue-950/70 font-medium mb-5'>Recent Bookings</h2>
            <div className='w-full max-w-3xl text-left border border-gray-300 rounded-lg max-h-80 overflow-y-scroll '>
                <table className='w-full'>
                    <thead className='bg-gray-50'>
                        <tr>
                            <th className='py-3 px-4 text-gray-800 font-medium'>User Name</th>
                            <th className='py-3 px-4 text-gray-800 font-medium max-sm:hidden'>Room Name</th>
                            <th className='py-3 px-4 text-gray-800 font-medium text-center'>Total Amount</th>
                            <th className='py-3 px-4 text-gray-800 font-medium text-center'>Payment Status</th>

                        </tr>
                    </thead>
                    <tbody className='text-sm'>
                        {dashboardData.bookings.map((item , index)=>(
                            <tr key = {index}>
                                <td className='py-3 px-4 text-gray-700 bordet-t border-gray-300'>
                                    {item.user.username}
                                </td>
                                <td className='py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:hidden'>
                                    {item.room.roomType}
                                </td>
                                 <td className='py-3 px-4 text-gray-700 bordet-t border-gray-300 text-center'>
                                    {currency} {item.totalPrice}
                                </td>
                                <td className='py-3 px-4 bordet-t border-gray-300 flex'> 
                                    <button className={`py-1 px-3 text-xs rounded-full max-auto 
                                    ${item.isPaid ? 'bg-green-200 text-green-600' : 'bg-amber-200 text-yellow-600'}`}>
                                        {item.isPaid ? 'Completed' : 'Pending'}
                                    </button>

                                </td>

                            </tr>
                        ))}

                    </tbody>
                </table>

            </div>
        </div>
    )
}

export default Dashboard