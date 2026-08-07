import React, { useState } from 'react'
import Title from '../../Components/Title.jsx'
import { assets } from '../../assets/assets.js';
import { useAppContext } from '../../context/AppContext.jsx';
import { toast } from 'react-hot-toast';

const AddRoom = () => {
  const {axios , getToken} = useAppContext(); //get the axios instance and getToken function from the context to make API calls with authentication
  const [images , setImages] = useState({
    1: null,
    2: null,
    3: null,
    4: null
  });

  const [inputs , setInputs] = useState({
    roomType: '',
    PricePerNight: 0,
    amenities: {
      'Free Wifi' : false,
      'Free Breakfast' : false,
      'Room Service' : false,
      'Mountain view' : false,
      'Pool Access' : false
    }
  });

  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (event)=>{
     event.preventDefault(); //prevent the default form submission behavior
      //check if all inputs are filled
      if(!inputs.roomType || !inputs.PricePerNight || Object.values(images).every(image => image === null)){
        toast.error("Please fill all the fields and upload at least one image.");
        return;
      }
      setLoading(true);
      try{
      const formData = new FormData();
      formData.append('roomType', inputs.roomType);
      formData.append('PricePerNight', inputs.PricePerNight);
      //converting aminities object to array of selected amenities and keeping only enabled aminities
      const aminities = Object.keys(inputs.amenities).filter(amenity => inputs.amenities[amenity]);
      formData.append('amenities', JSON.stringify(aminities));
      //adding images to FormData
      Object.keys(images).forEach(key => {
        images[key] && formData.append('images', images[key]);
      });
      const {data} = await axios.post('/api/rooms', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${await getToken()}` //use the auth token in the request header
        }
      });

      if (data.success) {
        toast.success(data.message); //show success message
        setInputs({
          roomType: '',
          PricePerNight: 0,
          amenities: {
            'Free Wifi' : false,
            'Free Breakfast' : false,
            'Room Service' : false,
            'Mountain view' : false,
            'Pool Access' : false
          }
        });
        setImages({
          1: null,
          2: null,
          3: null,
          4: null
        });
      } else {
        toast.error(data.message); //show error message if the API call fails
      }

    }catch(error){
      toast.error("Error occurred while adding the room.");
    }finally{
      setLoading(false);
    } 
  }

  return (
    <form onSubmit = {onSubmitHandler}>
      <Title align="left" font = "outfit" title = "Add Room" subTitle= "Fill in the details carefully and accurate room details,
       pricing, and amenites, to enhance the user booking experience." />

       {/* Upload Area For Images */}
       <p className='text-gray-800 mt-10'>Images</p>
       <div className='grid grid-cols-2 sm:flex gap-4 my-2 flex-wrap'>
        {Object.keys(images).map((key)=>(
          <label htmlFor={`roomImage${key}`} key={key}>
            <img src = {images[key] ? URL.createObjectURL(images[key]) : assets.uploadArea} alt = '' className='max-h-24 cursor-pointer object-cover'/>
            <input type = 'file' accept='image/*' id={`roomImage${key}`} hidden
            onChange={e => setImages({...images, [key] : e.target.files[0]})}/>
          </label>
        ))}
       </div>
       <div className='w-full flex max-sm:flex-col sm:gap-4 mt-4'>
        <div className='flex-1 max-w-48'>
          <p className='text-gray-800 mt-4'>
            Room Type
          </p>
          <select value={inputs.roomType} onChange = {e => setInputs({...inputs , roomType: e.target.value})} className='border opacity-70 border-gray-300 mt-1 rounded p-2 w-full'>
            <option value = ''>Select Room Type</option>
            <option value= 'Single Bed'>Single Bed</option>
            <option value = 'Double Bed'>Double Bed</option>
            <option value='Luxury Room'>Luxury Room</option>
            <option value = 'Family Suite'>Family Suite</option>
          </select>
        </div>
        <div>
          <p className='mt-4 text-gray-800'>
            Price<span className='text-xs'>/night</span>
          </p>
          <input type='number' placeholder='0' className='border border-gray-300 mt-1 rounded p-2 w-24'
          value={inputs.PricePerNight} onChange={e=>setInputs({...inputs , PricePerNight: e.target.value})}/>
        </div>
       </div>
       <p className='text-gray-800 mt-4'>Aminities</p>
       <div className='flex flex-col flex-wrap mt-1 text-gray-400 max-w-sm'>
        {Object.keys(inputs.amenities).map((amenity , index)=>(
          <div key={index}>
            <input type='checkbox' id={`amenities${index+1}`} checked={inputs.amenities[amenity]} 
            onChange={()=>setInputs({...inputs , amenities: {...inputs.amenities , [amenity]: !inputs.amenities[amenity]}})}/>
            <label htmlFor={`amenities${index+1}`}> {amenity}</label>
          </div>
        ))}
       </div>
       <button className='bg-primary text-white px-8 py-2 rounded mt-8 cursor-pointer disabled:opacity-50' disabled={loading}>
        {loading ? "Adding..." : "Add Room"}
        </button>

    </form>
  )
}

export default AddRoom