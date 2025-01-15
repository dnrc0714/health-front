import React, { useState } from "react"

import axios from "axios";
import {useLocation} from "react-router-dom";
import { EditorState } from 'draft-js';
import {Editor} from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import PostEditor from "./PostEditor";
import ControlledEditor from "./PostEditor";

const editorStyle = {
    cursor: "pointer",
    width: "100%",
    minHeight: "20rem",
    border: "2px solid rgba(209, 213, 219, var(--tw-border-opacity))",
};

const toolbar={
    options: [
        "fontSize",
        "fontFamily",
        "list",
        "textAlign",
        "colorPicker",
        "link",
        "embedded",
        "emoji",
        "image",
        "remove",
        "history",
    ],
};

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
        setEditorState(newState); // 부모 상태 업데이트
    };

    // 게시 버튼 클릭 핸들러
    const handleSubmit = () => {
        if (!title.trim()) {
            alert("제목을 입력해주세요.");
            return;
        }


        // if (!content.trim()) {
        //     alert("내용을 입력해주세요.");
        //     return;
        // }

        // FormData 생성
        const formData = new FormData();
        formData.append("title", title);
        // formData.append("content", content);
        formData.append("state", location.state.status);
        if (file) {
            formData.append("file", file);
        }

        postSave(formData);
    }

    const postSave = async (formData: FormData) => {
        const response = await axios.post('/post/save', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        if(response) {
            alert("게시글이 성공적으로 등록되었습니다.");
            setTitle("");
            setFile(null);
            // setContent(content);
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
                </label>
                <div className="w-full items-center">
                    {/*<ControlledEditor*/}
                    {/*    editorState={editorState}*/}
                    {/*    onEditorStateChange={handleEditorStateChange}*/}
                    {/*/>*/}
                    <>
                         <Editor
                             editorState={editorState}
                             // toolbarClassName="toolbar-className"
                            wrapperClassName="wrapper-className"
                            editorClassName="editor-className"
                            editorStyle={editorStyle}
                            placeholder="내용을 작성해주세요."
                            localization={{
                                locale: 'ko',
                           }}

                            onEditorStateChange={handleEditorStateChange}
                        />
                    </>
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
