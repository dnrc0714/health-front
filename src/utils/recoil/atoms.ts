import { atom } from "recoil";
import {CodeType} from "../../types/codeType";

export const authState = atom({
    key: "authState",
    default: false
});

export const typeState = atom<CodeType | null>({
    key: "typeState",
    default: null
});
