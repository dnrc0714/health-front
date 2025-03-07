import { useState } from "react";
import { EditorState } from "draft-js";

type Mode = "create" | "view" | "edit";

interface UsePostProps {
    postId?: string;
}

export default function usePost({ postId }: UsePostProps) {
    const isCreateMode = !postId; // postId가 없으면 작성(create) 모드
    const [values, setValues] = useState({
        mode: isCreateMode ? "create" : "view" as Mode,
        postTp: "",
        title: "",
        file: null as File | null,
        editorState: EditorState.createEmpty(),
    });

    // 입력 값 변경 핸들러
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const newValue = type === "file" ? (e.target as HTMLInputElement).files?.[0] || null : value;

        setValues((prev) => ({
            ...prev,
            [name]: newValue,
        }));
    };

    // 특정 필드 값 변경
    const setFieldValue = (field: keyof typeof values, value: any) => {
        setValues((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    // 폼 초기화
    const resetForm = () => {
        setValues({
            mode: isCreateMode ? "create" : "view",
            postTp: "",
            title: "",
            file: null,
            editorState: EditorState.createEmpty(),
        });
    };

    return {
        values,
        handleChange,
        setFieldValue,
        resetForm,
    };
}