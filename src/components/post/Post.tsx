import React, { useCallback, useEffect, useState } from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import { GetPost, SavePost } from "../../services/post/PostService";
import {ContentState, convertFromHTML, convertToRaw, EditorState} from "draft-js";
import draftToHtml from "draftjs-to-html";
import DOMPurify from "dompurify";
import PostEditor from "./PostEditor";

import { stateFromHTML } from "draft-js-import-html";
import htmlToDraft from "html-to-draftjs";

type Mode = "view" | "edit" | "create";

export default function Post() {
    const navigate = useNavigate();
    const { postId } = useParams<{ postId?: string }>(); // URL에서 postId 가져오기
    const location = useLocation();
    const isCreateMode = !postId; // postId가 없으면 작성(create) 모드
    const [mode, setMode] = useState<Mode>(isCreateMode ? "create" : "view");
    const queryClient = useQueryClient(); // QueryClient 생성


    const { data, isLoading, error } = useQuery({
        queryKey: ["post", postId],
        queryFn: () => GetPost(Number(postId)),
        enabled: !!postId, // postId가 있을 때만 실행
    });

    const [title, setTitle] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

    useEffect(() => {
        if (data) {
            console.log(data.content);
            const blocksFromHtml = htmlToDraft(data.content);
            const { contentBlocks, entityMap } = blocksFromHtml;
            const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
            const editorState = EditorState.createWithContent(contentState);

            setTitle(data.title);
            setEditorState(editorState); // WYSIWYG Editor는 HTML 데이터를 상태로 변환하는 로직 필요
        }
     }, [data]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleEditorStateChange = (newState: EditorState) => {
        setEditorState(newState);
    };

    const saveMutation = useMutation({
        mutationFn: async (formData: FormData) => {
            return SavePost(formData);
        },
        onSuccess: async (data) => {
            alert("게시글이 성공적으로 저장되었습니다.");
            if(postId) {
                await queryClient.invalidateQueries({ queryKey: ["post", String(postId)] });
            } else {
                navigate(`/post/${data.postId}`);
            }
            setMode("view");
        },
        onError: () => {
            alert("게시글 저장에 실패했습니다.");
        },
    });

    const handleSubmit = useCallback(async () => {
        const contentState = editorState.getCurrentContent().hasText();
        const content = editorState.getCurrentContent();

        if (!title.trim()) {
            alert("제목을 입력해주세요.");
            return;
        }

        if (!contentState) {
            alert("내용을 입력해주세요.");
            return;
        }

        const htmlContent = draftToHtml(convertToRaw(content));
        const refreshToken = localStorage.getItem("refreshToken");

        const formData = new FormData();
        if(postId) {
            formData.append("postId", postId);
        }
        formData.append("title", title);
        formData.append("content", htmlContent);
        formData.append("state", location.state?.status || "published");

        if (refreshToken) {
            formData.append("refreshToken", refreshToken);
        }
        if (file) {
            formData.append("file", file);
        }

        saveMutation.mutate(formData);
    }, [title, editorState, file]);

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>게시글을 불러오는데 실패했습니다.</p>;

    return (
        <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
            <h1 className="text-center font-bold text-3xl mb-2.5">
                {mode === "create" ? "게시글 작성" : "게시글 상세"}
            </h1>

            {/* 제목 */}
            <div style={{ marginBottom: "10px" }}>
                <label>
                    <strong>제목:</strong>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        disabled={mode === "view"}
                        style={{
                            width: "100%",
                            padding: "10px",
                            fontSize: "16px",
                            marginTop: "5px",
                            boxSizing: "border-box",
                            backgroundColor: mode === "view" ? "#f0f0f0" : "white",
                        }}
                        placeholder="제목을 입력하세요"
                    />
                </label>
            </div>

            {/* 내용 */}
            <div style={{ marginBottom: "10px" }}>
                <label>
                    <strong>내용:</strong>
                </label>
                {mode === "view" ? (
                    <div
                        className="w-full items-center"
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data?.content || "") }}
                        style={{
                            padding: "10px",
                            backgroundColor: "#f0f0f0",
                            minHeight: "50px",
                        }}
                    />
                ) : (
                    <PostEditor editorState={editorState} onEditorStateChange={handleEditorStateChange} />
                )}
            </div>

            {/* 첨부 파일 */}
            <div style={{ marginBottom: "20px" }}>
                <label>
                    <strong>첨부파일:</strong>
                    <input type="file" onChange={handleFileChange} disabled={mode === "view"} />
                </label>
            </div>

            {/* 버튼 */}
            <div style={{ textAlign: "right" }}>
                {mode === "view" ? (
                    <button
                        onClick={() => setMode("edit")}
                        style={{
                            padding: "10px 20px",
                            fontSize: "16px",
                            backgroundColor: "green",
                            color: "white",
                            border: "none",
                            cursor: "pointer",
                            borderRadius: "5px",
                        }}
                    >
                        수정
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        style={{
                            padding: "10px 20px",
                            fontSize: "16px",
                            backgroundColor: "blue",
                            color: "white",
                            border: "none",
                            cursor: "pointer",
                            borderRadius: "5px",
                        }}
                    >
                        저장
                    </button>
                )}
            </div>
        </div>
    );
}