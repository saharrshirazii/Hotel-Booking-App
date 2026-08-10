import React, { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import Title from '../../Components/Title';
import { useAppContext } from '../../context/AppContext';

const ListRoom = () => {
    const [rooms, setRooms] = useState([]); //state to save the list of rooms fetched from the backend API;
    const { axios, getToken, user , currency } = useAppContext(); //get the axios instance and getToken function from the context to make API calls with authentication

    //Fetch Rooms of the Hotel Owner
    const fetchRooms = async () => {
        try {
            const { data } = await axios.get('/api/rooms/owner', { headers: { Authorization: `Bearer ${await getToken()}` } }); //send a GET request to the backend API to fetch the rooms of the hotel owner with auth token in the header
            if (data.success) {
                setRooms(data.rooms); //save the fetched rooms in the state
            } else {
                toast.error(data.message); //log the error message if the API call fails    
            }

        } catch (error) {
            toast.error(error.message); //log the error message if the API call fails
        }
    }

    //Toggle Availability of a Room
    const toggleAvailability = async (roomId) => {
        try {
            const { data } = await axios.post('/api/rooms/toggle-availability', { roomId }, { headers: { Authorization: `Bearer ${await getToken()}` } }); //send a POST request to the backend API to toggle the availability of a room with auth token in the header
            if (data.success) {
                toast.success(data.message); //show success message
                fetchRooms(); //fetch the updated list of rooms after toggling availability
            } else {
                toast.error(data.message); //show error message if the API call fails
            }

        } catch (error) {
            toast.error(error.message); //show error message if the API call fails
        }
    }


    useEffect(() => {
        if (user) {
            fetchRooms(); //fetch the rooms when the component mounts and when the user state changes (i.e. when the user logs in or out)
        }
    }, [user]);



    return (
        <div>
            <Title align='left' font='outfit' title='Room Listings'
                subTitle='View, edit, or manage all listed rooms. Keep the information up-to-date to provide the best experience for users.' />
            <p className='text-gray-500 mt-8'>All Rooms</p>
            <div className='w-full max-w-3xl text-left border border-gray-300 rounded-lg max-h-80 overflow-y-scroll mt-3'>
                <table className='w-full'>
                    <thead className='bg-gray-50'>
                        <tr>
                            <th className='py-3 px-4 text-gray-800 font-medium'> Name</th>
                            <th className='py-3 px-4 text-gray-800 font-medium max-sm:hidden'>Facility</th>
                            <th className='py-3 px-4 text-gray-800 font-medium text-center'>Price / night</th>
                            <th className='py-3 px-4 text-gray-800 font-medium text-center'>Actions</th>

                        </tr>
                    </thead>
                    <tbody className='text-sm'>
                        {rooms.map((item, index) => (
                            <tr key={index}>
                                <td className='py-3 px-4 text-gray-700 border-t border-gray-300'>
                                    {item.roomType}
                                </td>
                                <td className='py-3 px-4 text-gray-700 border-t border-gray-300'>
                                    {item.amenities.join(' , ')}
                                </td>
                                <td className='py-3 px-4 text-gray-700 border-t border-gray-300'>
                                    {item.pricePerNight} {currency}
                                </td>
                                <td className='py-3 px-4 text-gray-700 border-t border-gray-300 text-sm text-red-500 text-center'>
                                    <label className='relative inline-flex items-center cursor-pointer text-gray-900 gap-3'>
                                        <input type='checkbox' className='sr-only peer' checked={item.isAvailable} onChange={() => toggleAvailability(item._id)} />
                                        <div className='w-12 h-7 bg-slate-300 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200'></div>
                                        <span className='dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5'></span>

                                    </label>
                                </td>
                            </tr>
                        ))}

                    </tbody>
                </table>
            </div>


        </div>
    )
}

export default ListRoom