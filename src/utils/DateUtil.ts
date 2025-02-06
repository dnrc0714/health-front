import dayjs from "dayjs";

export const formatISODate = (isoString: string)=> {
    return  dayjs(isoString).format("YYYY-MM-DD HH:mm");
}