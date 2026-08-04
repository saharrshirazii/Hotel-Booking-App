import React from 'react'
import Navbar from './Components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './Pages/Home'
import Footer from './Components/Footer'
import AllRooms from './Pages/AllRooms'
import { RoomDetails } from './Pages/RoomDetails'
import MyBookings from './Pages/MyBookings'
import { HotelReg } from './Components/HotelReg'
import Layout from './Pages/hotelOwner/Layout'
import AddRoom from './Pages/hotelOwner/AddRoom'
import ListRoom from './Pages/hotelOwner/ListRoom'
import Dashboard from './Pages/hotelOwner/Dashboard'
import {Toaster} from 'react-hot-toast'
import { useAppContext } from './context/AppContext.jsx'


const App = () => {

  //we do not show the navbar in owner dashboard.
  const isOwnerPath = useLocation().pathname.includes('owner');
  const {showHotelReg} = useAppContext(); //get the showHotelReg state from the context
  return (
    <div>
      <Toaster />
      {!isOwnerPath && <Navbar />}
      {showHotelReg && <HotelReg />} {/* show the hotel registration form if the showHotelReg state is true */}
      <div className='min-h-[70vh]'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/rooms' element={<AllRooms />} />
          <Route path='/rooms/:id' element={<RoomDetails />} />
          <Route path='/my-bookings' element={<MyBookings />} />
          <Route path='/owner' element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path='add-room' element={<AddRoom />} />
            <Route path='list-room' element={<ListRoom />} />

          </Route>
        </Routes>
      </div>
              <Footer />



    </div>
  )
}


export default App
