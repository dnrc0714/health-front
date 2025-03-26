import {UserType} from "./userType";

export interface ChatMessageType {
    id: number;
    content: string;
    creator?: UserType;
}