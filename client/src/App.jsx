import React from 'react'
import Navbar from './Components/NavBar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './Pages/Home'
import Footer from './Components/Footer'
import AllRooms from './Pages/AllRooms'
import { RoomDetails } from './Pages/RoomDetails'

const App = ()=>{

  //we do not show the navbar in owner dashboard.
  const isOwnerPath = useLocation().pathname.includes('owner');
  return(
    <div>
      {!isOwnerPath && <Navbar/>}
        <div className='min-h-[70vh]'>
          <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/rooms' element={<AllRooms/>}/>
            <Route path='/rooms/:id' element={<RoomDetails/>}/>

          </Routes>
          <Footer/>
        </div>

      
    </div>
  )
}


export default App