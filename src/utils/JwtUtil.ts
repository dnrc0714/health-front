import {jwtDecode} from "jwt-decode";
import {UserType} from "../types/userType";

export const getLoggedUser = (refreshToken: string) => {

    if(refreshToken) {
        const decodedToken: UserType = jwtDecode(refreshToken);

    return decodedToken;
    }
}