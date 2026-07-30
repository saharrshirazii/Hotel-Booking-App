//Get  /api/user
export const getUserData = async (req, res) => {
    try {
        const role = req.user.role;
        const recentSearchedCities = req.user.recentSearchedCities;
        res.json({ success: true, role, recentSearchedCities })
    }
    catch (error) {
        res.json({ success: false, message: error.message })
    }
}

//store User Recent Searched Cities
export const storeRecentSearchedCities = async (req , res) => {
    try{
        const {recentSearchedCity} = req.body;
        const user = await req.user;

        if(user.recentSearchedCities.length < 3){ //we will store max 3 city name in that array
            user.recentSearchedCities.push(recentSearchedCity);
        }else {
            user.recentSearchedCities.shift();
            user.recentSearchedCities.push(recentSearchedCity);

        }
        await user.save(); //save the user in db
        res.json({success: true, message: 'city added'})

    }catch(error){
        res.json({success: false, message: error.message})

    }
}