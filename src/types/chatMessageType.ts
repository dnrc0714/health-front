import {UserType} from "./userType";
import {LoadFileType} from "./loadFileType";

export interface ChatMessageType {
    id: number;
    content: string;
    s3Url: string;
    creator?: UserType;
    createdAt?: string;
    chatFile?: LoadFileType[];
}