import { atom } from "recoil";
import {UserType} from "../../types/codeType";

export const authState = atom({
    key: "authState",
    default: false
});

export const typeState = atom<UserType | null>({
    key: "typeState",
    default: null
});
