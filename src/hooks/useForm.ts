import React, {useState} from "react";

type UseForm = Record<string, any>;

export default function useForm(initialValues: UseForm = {}) {
    const [values, setValues] = useState<UseForm>(initialValues);

    // 값 변경 핸들러
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        const newValue = type === "checkbox" && "checked" in e.target ? (e.target as HTMLInputElement).checked : value;

        setValues((prevValues) => ({
            ...prevValues,
            [name]: newValue,
        }));
    };

    // 필드 추가
    const addField = (fieldName: string, value: any = "") => {
        setValues((prevValues) => ({
            ...prevValues,
            [fieldName]: value,
        }));
    };

    // 필드 제거
    const removeField = (fieldName: string) => {
        setValues((prevValues) => {
            const newValues = { ...prevValues };
            delete newValues[fieldName];
            return newValues;
        });
    };

    // 폼 초기화
    const resetForm = () => setValues(initialValues);

    return {
        values,
        handleChange,
        addField,
        removeField,
        resetForm,
    };
}