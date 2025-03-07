import {useState} from "react";

type UseErrors = Record<string, string>;

export default function useErrors(initialErrors: UseErrors = {}) {
    const [errors, setErrors] = useState<UseErrors>(initialErrors);

    // 에러 추가 또는 업데이트
    const setError = (field: string, message: string) => {
        setErrors((prevErrors) => ({
            ...prevErrors,
            [field]: message,
        }));
    };

    // 특정 필드의 에러 삭제
    const removeError = (field: string) => {
        setErrors((prevErrors) => {
            const newErrors = {...prevErrors};
            delete newErrors[field];
            return newErrors;
        });
    };

    // 모든 에러 초기화
    const resetErrors = () => setErrors(initialErrors);

    return {
        errors,
        setError,
        removeError,
        resetErrors,
    };
}