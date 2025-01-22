import React, { useState } from "react"

import {useLocation} from "react-router-dom";
import {convertToRaw, EditorState} from 'draft-js';
import PostEditor from "./PostEditor";
import {SavePost} from "../../services/post/PostService";
import draftToHtml from "draftjs-to-html";

export default function PostWrite(){
    const location = useLocation();
    const [title, setTitle] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

    // 첨부파일 변경 핸들러
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleEditorStateChange = (newState: EditorState) => {
        setEditorState(newState);
    };

    // 게시 버튼 클릭 핸들러
    const handleSubmit = async () => {
        const contentState = editorState.getCurrentContent();


        if (!title.trim()) {
            alert("제목을 입력해주세요.");
            return;
        }

        if(!contentState) {
            alert("내용을 입력해주세요.");
            return;
        }
        const htmlContent = draftToHtml(convertToRaw(contentState));
        const refreshToken = localStorage.getItem('refreshToken');
        // FormData 생성
        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", htmlContent);
        formData.append("state", location.state.status);
        if (refreshToken) {
            formData.append("refreshToken", refreshToken); // refreshToken 추가
        }

        if (file) {
            formData.append("file", file);
        }

        try {
            const response = await SavePost(formData);
            if (response) {
                alert("게시글이 성공적으로 등록되었습니다.");

                // 상태 초기화
                setTitle("");
                setFile(null);
                setEditorState(EditorState.createEmpty()); // 에디터 상태 초기화
            }
        } catch (error) {
            console.error("게시글 등록 실패:", error);
            alert("게시글 등록에 실패했습니다. 다시 시도해주세요.");
        }
    }

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
                </label>
                <div className="w-full items-center">
                    <PostEditor
                        editorState={editorState}
                        onEditorStateChange={handleEditorStateChange}
                    />
                </div>
            </div>
            <div style={{marginBottom: "20px"}}>
                <label>
                    <strong>첨부파일:</strong>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        style={{marginTop: "10px"}}
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
