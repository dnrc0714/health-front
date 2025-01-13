import React, {useRef, useState} from "react"
import {Editor} from "@toast-ui/react-editor";
import '@toast-ui/editor/dist/i18n/ko-kr';
import colorPlugin from "@toast-ui/editor-plugin-color-syntax";
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';
import PostEditor from "./PostEditor";

export default function PostWrite(){
    const editorRef = useRef<Editor>(null);
    const [title, setTitle] = useState('');
    const [file, setFile] = useState<File | null>(null);

    // 첨부파일 변경 핸들러
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    // 게시 버튼 클릭 핸들러
    const handleSubmit = () => {
        if (!title.trim()) {
            alert("제목을 입력해주세요.");
            return;
        }

        if (editorRef.current) {
            const content = editorRef.current.getInstance().getMarkdown();
            if (!content.trim()) {
                alert("내용을 입력해주세요.");
                return;
            }

            // FormData 생성
            const formData = new FormData();
            formData.append("title", title);
            formData.append("content", content);
            if (file) {
                formData.append("file", file);
            }

            // 서버로 데이터 전송 (예: fetch API 사용)
            console.log("Form Data:", {
                title,
                content,
                fileName: file?.name,
            });

            alert("게시글이 성공적으로 등록되었습니다.");
            setTitle("");
            setFile(null);
            editorRef.current.getInstance().setMarkdown("");
        }
    };

    return (
        <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
            <h1 className="text-center font-bold text-3xl mb-2.5">게시글 작성</h1>
            <div style={{ marginBottom: "10px" }}>
                <label>
                    <strong>제목:</strong>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "10px",
                            fontSize: "16px",
                            marginTop: "5px",
                            boxSizing: "border-box",
                        }}
                        placeholder="제목을 입력하세요"
                    />
                </label>
            </div>
            <div style={{ marginBottom: "10px" }}>
                <label>
                    <strong>내용:</strong>
                    <PostEditor editorRef={editorRef}/>
                </label>
            </div>
            <div style={{ marginBottom: "20px" }}>
                <label>
                    <strong>첨부파일:</strong>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        style={{ marginTop: "10px" }}
                    />
                </label>
            </div>
            <div>
                <button
                    onClick={handleSubmit}
                    style={{
                        padding: "10px 20px",
                        fontSize: "16px",
                        backgroundColor: "#4CAF50",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                    }}
                >
                    게시하기
                </button>
            </div>
        </div>
    );
}
