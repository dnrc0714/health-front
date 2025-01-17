import React from "react";
import Register from "../../components/auth/Register";

export default function RegisterPage({ setIsLoggedIn }: { setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>}) {
    return (
      <Register setIsLoggedIn={setIsLoggedIn}/>
    );
}