import React from "react";
import {Editor} from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {EditorState} from "draft-js";


const editorStyle = {
    cursor: "pointer",
    width: "100%",
    minHeight: "8rem",
    borderRadius: "5px",
    border: "1px solid skyblue",
    backgroundColor: "white",
};

type EditorProps = {
    editorState: EditorState;
    onEditorStateChange: (newState: EditorState) => void;
};

export default function PostEditor({editorState, onEditorStateChange}:EditorProps) {
    return (
        <>
            <Editor
                editorState={editorState}
                toolbarClassName="toolbar-className"
                wrapperClassName="wrapper-className"
                editorClassName="editor-className"
                editorStyle={editorStyle}
                toolbar={{
                    // inDropdown: 해당 항목과 관련된 항목을 드롭다운으로 나타낼것인지
                    list: { inDropdown: true },
                    textAlign: { inDropdown: true },
                    link: { inDropdown: true },
                    history: { inDropdown: false },
                    image: {
                        urlEnabled: true,
                        uploadEnabled: false, // 기본 업로드 비활성화 (커스텀 핸들러 사용 예정)
                        previewImage: true,
                        alt: { present: true, mandatory: false },
                    },
                }}
                toolbarStyle={{
                    borderRadius: "10px", // 툴바의 모서리를 둥글게
                    border: "1px solid #ccc", // 테두리 추가 (선택 사항)
                    backgroundColor: "#f8f8f8", // 배경색 변경 (선택 사항)
                }}
                placeholder="내용을 작성해주세요."
                localization={{
                    locale: 'ko',
                }}

                onEditorStateChange={onEditorStateChange}
            />
        </>
    );
}