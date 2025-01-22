import React from "react";
import {Editor} from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {EditorState} from "draft-js";


const editorStyle = {
    cursor: "pointer",
    width: "100%",
    minHeight: "8rem",
    border: "2px solid rgba(209, 213, 219, var(--tw-border-opacity))",
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