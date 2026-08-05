import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import { assets, cities } from '../assets/assets'
import { useAppContext } from '../context/AppContext.jsx'

export const HotelReg = () => {

  const { setShowHotelReg, axios, getToken, setIsOwner } = useAppContext(); //get the setShowHotelReg function from the context to close the hotel registration form

  //state to save  form fields
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [city, setCity] = useState("");

  const onSubmitHandler = async (event) => {
    try {
      event.preventDefault(); //prevent the default form submission behavior

      const token = await getToken();
      const { data } = await axios.post(
        `/api/hotels/`,
        { name, address, contact, city },
        { headers: { Authorization: `Bearer ${token}` } }); //send a POST request to the backend API to register the hotel with the form data and auth token in the header
      if (data.success) {
        toast.success(data.message); //show success message
        setIsOwner(true); //set the user as hotel owner
        setShowHotelReg(false); //close the hotel registration form
      } else {
        toast.error(data.message); //show error message if the API call fails
      }

    } catch (error) {
      toast.error(error.message); //show generic error message
    }

  }

  return (
    <div onClick={() => setShowHotelReg(false)} className='fixed top-0 bottom-0 left-0 right-0 z-100 flex items-center justify-center bg-black/70'>
      <form onSubmit={onSubmitHandler} onClick={(e) => e.stopPropagation()} className='flex bg-white rounded-xl max-w-4xl max-md:max-2'>
        <img src={assets.regImage} alt="reg-image" className='w-1/2 rounded-xl hidden md:block' />
        <div className='relative flex flex-col items-center md:w-1/2 p-8 md:p-10'>
          <img src={assets.closeIcon} alt="close-icon" className='absolute top-4 right-4 h-4 w-4 cursor-pointer'
            onClick={() => setShowHotelReg(false)}
          />
          <p className='text-2xl font-semibold mt-6'>Register Your Hotel</p>

          {/* Hotel Name */}
          <div className='w-full mt-4'>
            <label htmlFor="contac" className='font-medium text-gray-500' Hotel Name>Hotel Name</label>
            <input id='name' onChange={(e) => setName(e.target.value)} value={name} type="text" placeholder='Type Hotel Name' className='border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light' required />
          </div>

          {/* Phone */}
          <div className='w-full mt-4'>
            <label htmlFor="contac" className='font-medium text-gray-500' Hotel Name>Phone</label>
            <input id='contact' onChange={(e) => setContact(e.target.value)} value={contact} type="text" placeholder='Type Phone' className='border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light' required />
          </div>

          {/* Address */}
          <div className='w-full mt-4'>
            <label htmlFor="contaddressac" className='font-medium text-gray-500' Hotel Name>Address</label>
            <input id='address' onChange={(e) => setAddress(e.target.value)} value={address} type="text" placeholder='Type Address' className='border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light' required />
          </div>

          {/* Select City Drop Down */}
          <div className='w-full mt-4 max-w-60 mr-auto'>
            <label htmlFor="city" className='font-medium text-gray-500'>City</label>
            <select id="city" onChange={(e) => setCity(e.target.value)} value={city} className='border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light' required>
              <option>Select City</option>
              {cities.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <button type='submit' className='bg-indigo-500 hover:bg-indigo-600 transition-all text-white mr-auto px-6 py-2 rounded cursor-pointer mt-6 '>Register</button>

        </div>
      </form>
    </div>
  )
}
