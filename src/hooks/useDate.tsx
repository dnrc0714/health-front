import React, {useState} from "react";
import useForm from "./useForm";

export default function useDate() {
    const formState = useForm({
        date: null as Date | null
    });


}