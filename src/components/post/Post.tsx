import React, {useCallback, useEffect, useState} from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {DeletePost, GetPost, SavePost} from "../../services/post/PostService";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import DOMPurify from "dompurify";
import PostEditor from "./PostEditor";
import htmlToDraft from "html-to-draftjs";
import SelectBox from "../common/SelectBox";
import usePost from "../../hooks/usePost";
import Input from "../common/Input";
import Button from "../common/button/Button";
import {jwtDecode} from "jwt-decode";
import {UserType} from "../../types/userType";
import {getLoggedUser} from "../../utils/JwtUtil";

export default function Post() {
    const navigate = useNavigate();
    const { postId } = useParams<{ postId?: string }>();
    const location = useLocation();
    const queryClient = useQueryClient();
    const [loginUser, setLoginUser] = useState<UserType | null>(null);
    const [disabled, setDisabled] = useState<Boolean>(false);


    const { data, isLoading, error } = useQuery({
        queryKey: ["post", postId],
        queryFn: () => GetPost(Number(postId)),
        enabled: !!postId,
    });


    const { values, handleChange, setFieldValue } = usePost({ postId });

    useEffect(() => {
        if (data) {
            const blocksFromHtml = htmlToDraft(data.content);
            const { contentBlocks, entityMap } = blocksFromHtml;
            const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
            const editorState = EditorState.createWithContent(contentState);
            const refreshToken = localStorage.getItem("refreshToken") as string;

            const decodedToken = getLoggedUser(refreshToken);
            if(decodedToken !== undefined) {
                setLoginUser(decodedToken);
            }

            setFieldValue("title", data.title);
            setFieldValue("postTp", data?.postTp);
            setFieldValue("editorState", editorState);
        } else {
            setDisabled(false);
        }
    }, [data]);

    const saveMutation = useMutation({
        mutationFn: async (formData: FormData) => SavePost(formData),
        onSuccess: async (data) => {
            alert("게시글이 성공적으로 저장되었습니다.");
            if (postId) {
                await queryClient.invalidateQueries({ queryKey: ["post", String(postId)] });
            } else {
                navigate(`/post/${data.postId}`);
            }
            setDisabled(true);
            setFieldValue("mode", "view");
        },
        onError: () => {
            alert("게시글 저장에 실패했습니다.");
        },
    });

    const handleSubmit = useCallback(async () => {
        const contentState = values.editorState.getCurrentContent().hasText();
        const content = values.editorState.getCurrentContent();

        if (!values.title.trim()) {
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
        if (postId) {
            formData.append("postId", postId);
        }
        formData.append("title", values.title);
        formData.append("content", htmlContent);
        formData.append("postTp", values.postTp);
        formData.append("state", location.state?.status || "published");

        if (refreshToken) {
            formData.append("refreshToken", refreshToken);
        }
        if (values.file) {
            formData.append("file", values.file);
        }

        saveMutation.mutate(formData);
    }, [values]);

    const handleCancel = () => {
        if(location.state?.status == 'new') {
            navigate('/post/');
        } else {
            setFieldValue("mode", "view");
            setDisabled(true);
        }

    }

    const deleteMutation = useMutation({
        mutationFn: async (postId:number)=> DeletePost(postId),
        onSuccess: async (data) => {
            if(data) {
                alert("게시글이 삭제 되었습니다.");
                navigate('/post/');
            }
        }
    });

    const handleDelete= () => {
        if(!postId) return;

        const confirmDelete = window.confirm("게시글을 삭제하시겠습니까?");

        if(confirmDelete) {
            deleteMutation.mutate(Number(postId));
        }
    }

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>게시글을 불러오는데 실패했습니다.</p>;

    return (
        <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
            <h1 className="text-center font-bold text-3xl mb-2.5">
                {values.mode === "create" ? "게시글 작성" : "게시글 상세"}
            </h1>

            {/* 제목 */}
            <div style={{ marginBottom: "10px" }}>
                <label>
                    <strong>제목:</strong>
                    <Input type={'text'} id={'title'} name={'title'} value={values.title} onChange={handleChange} className={'input-text'} placeholder={'제목을 입력하세요.'} maxLength={20} mode={values.mode}/>
                </label>
            </div>

            {/* 구분 */}
            <div>
                <label>
                    <strong>구분:</strong>
                </label>
                <SelectBox
                    code={'002'}
                    val={values.postTp}
                    changeState={(e) => setFieldValue("postTp", e.target.value)}
                    changeId={'postTp'}
                    mode={values.mode}
                    postTp={location.state?.postTp}
                />
            </div>

            {/* 내용 */}
            <div style={{ marginBottom: "10px" }}>
                <label>
                    <strong>내용:</strong>
                </label>
                {values.mode === "view" ? (
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
                    <PostEditor
                        editorState={values.editorState}
                        onEditorStateChange={(editorState) => setFieldValue("editorState", editorState)}
                    />
                )}
            </div>

            {/* 첨부 파일 */}
            <div style={{ marginBottom: "20px" }}>
                <label>
                    <strong>첨부파일:</strong>
                    <input
                        type="file"
                        name="file"
                        onChange={(e) => setFieldValue("file", e.target.files?.[0] || null)}
                        disabled={values.mode === "view"}
                    />
                </label>
            </div>

            {/* 버튼 */}
            { data?.creatorId == loginUser?.userId &&
                (
                    <div style={{ textAlign: "right" }}>
                        {values.mode === "view" ? (
                            <div className="flex justify-end gap-2">
                                <Button label={"수정"} type={"button"} onClick={() => {setFieldValue("mode", "edit"); setDisabled(true)}} className={'edit-btn'}/>
                                <Button label={"삭제"} type={"button"} onClick={handleDelete} className={'delete-btn'}/>
                            </div>
                        ) : (
                            <div className="flex justify-end gap-2">
                                <Button label={"취소"} type={"button"} onClick={handleCancel} className={'edit-btn'}/>
                                <Button label={"저장"} type={"button"} className={'apply-btn-flex'} onClick={handleSubmit}/>
                                <Button label={"삭제"} type={"button"} onClick={handleDelete} className={'delete-btn'}/>
                            </div>
                        )}
                    </div>
                )
            }
        </div>
    );
}