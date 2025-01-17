import React from "react";
import Login from "../../components/auth/Login";

export default function LoginPage({ setIsLoggedIn }: { setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>}) {
    return (
      <Login setIsLoggedIn={setIsLoggedIn}/>
    );
}