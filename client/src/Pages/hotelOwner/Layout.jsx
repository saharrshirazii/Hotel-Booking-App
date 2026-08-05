import React from 'react'
import Navbar from '../../Components/hotelOwner/Navbar'
import Sidebar from '../../Components/hotelOwner/Sidebar'
import { Outlet } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext.jsx'
import { useEffect } from 'react'


const Layout = () => {
    const {isOwner , navigate} = useAppContext(); //get the isOwner state from the context to check if the user is a hotel owner

    //if the user is not a hotel owner, redirect to the home page
    useEffect(()=>{
        if(!isOwner){
            navigate('/')
        }
    }, [isOwner]) //run this effect when the isOwner state changes or when the navigate function changes;

    return (
        <div className='flex flex-col h-screen'>
            <Navbar />
            <div className='flex h-full'>
                <Sidebar/>
                <div className='flex-1 p-4 pt-10 md:px-10 h-full'>
                    <Outlet/>
                </div>
            </div>
        </div>
    )
}

export default Layout