import React, {useRef} from "react"
import {Editor} from "@toast-ui/react-editor";
import '@toast-ui/editor/dist/i18n/ko-kr';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';
import '@toast-ui/editor/dist/toastui-editor.css'; // 기본 스타일

type Props = {
    editorRef: React.RefObject<Editor | null>;
    content?: string;
};


export default function PostEditor({content, editorRef}: Props) {
    const toolbarItems = [
        ['bold', 'italic', 'strike'],
        ['hr', 'quote'],
        ['ul', 'ol', 'task', 'indent', 'outdent'],
        ['table', 'image', 'link'],
        ['code', 'codeblock'],
        ['scrollSync'],
    ];
    return (
        <div className="w-full items-center">
             <Editor
                initialValue={content || '내용을 입력해주세요.'}
                previewStyle="tab"
                height={"600px"}
                initialEditType="wysiwyg"
                theme={'dark'} // '' & 'dark'
                useCommandShortcut={false}
                language="ko-KR"
                ref={editorRef}
                toolbarItems={toolbarItems}
            />
        </div>
        );
}