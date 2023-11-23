import { createContext, useEffect, useState } from "react";

import { supabase } from "../supabaseClient";

import { getSafeContext } from "./getSafeContext";

type UserContextProps={
    logOut: ()=>void;
    setIsLogged: any;
    isLoggedIn: boolean;
}

export const UserContext=createContext<UserContextProps|null>(null)

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoggedIn, setIsLogged] = useState(false);
    useEffect(()=>{
        console.log(isLoggedIn);
    })
//   async function getProfile(id: string | undefined) {
//     const { data:image } = await supabase
//     .from('users')
//     .select('*')
//     .eq('id', id);
//     setImage(image && image[0].image);
//     setAvatar(image && image[0].image)
//     setId(image && image[0].id)
//     return image && image[0].image;
//   }

  const logOut=async()=>{
     setIsLogged(false);
     const { error } = await supabase.auth.signOut();
     if (error) throw error;
  }


    return (
      <UserContext.Provider value={{ setIsLogged, isLoggedIn, logOut }}>
        {children}
      </UserContext.Provider>
    );
  };

  export const useUserContext = getSafeContext(UserContext, "userContext")