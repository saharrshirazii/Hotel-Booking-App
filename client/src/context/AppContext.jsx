import axios from "axios"; //we will use axios package for the API call
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react"
import {toast} from 'react-hot-toast'
import { useEffect } from "react";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL; //we have our backend URL in our context file.

//create a context hook
const AppContext = createContext();

//provider function
export const AppProvider = ({ children }) => {
    const currency = import.meta.env.VITE_CURRENCY || $; //the app currency symbol from enviroment configuration
    const navigate = useNavigate(); //react router navigation helper
    const { user } = useUser(); //current logged in user from clerk auth provider                      
    const { getToken } = useAuth(); //a function for getting the authentication token.

    const [isOwner, setIsOwner] = useState(false); //wheather the current user is a hotel owner or not.
    const [showHotelReg, setShowHotelReg] = useState(false); //wheather to show the hotel registration form or not.
    const [searchedCities, setSearchedCities] = useState([]); //recent city search data.

    const fetchUser = async () => { //fetch the user details from the backend API
        try {
            const token = await axios.get();
            const { data } = await axios.get("/api/user", {
                headers: {
                    Authorization: `Bearer ${await getToken()}`, //use the auth token in the request header

                },
            });
            if (data.success) {
                setIsOwner(data.role === "hotelOwner"); //mark whether the user is a hotel owner
                setSearchedCities(data.recentSearchedCities); //save the recent searched cities 
            } else {
                //Retry fetching user detaiils after 5 seconds
                setTimeout(() => {
                    fetchUser();
                }, 5000)
            }
        } catch (error) {
            toast.error(error.message); //show error message if the API call fails
        }
    }

    useEffect(() => {
        if (user) {
            fetchUser();
        }
    }, [user]); //fetch user details when the user state changes (i.e. when the user logs in or out)

        const value = { //whatever provide in this value object we can access it in any component
            currency,
            navigate,
            user,
            getToken,
            isOwner, setIsOwner,
            showHotelReg, setShowHotelReg,
            searchedCities, setSearchedCities,
            axios
        }
        return (
            <AppContext.Provider value={value}>
                {children}
            </AppContext.Provider>
        )

    }

    export const useAppContext = () => useContext(AppContext);

