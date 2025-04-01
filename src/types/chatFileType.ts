export interface ChatFileType {
    roomId: number;
    files: File[] | null;
    file: File | null;
    type: string;
}