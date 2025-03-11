import React, {useEffect, useState} from "react"
import {Link, useNavigate} from "react-router-dom";
import {GetPostList} from "../../services/post/PostService";
import PageNavigator from "../common/PageNavigator";
import {useQuery} from "@tanstack/react-query";
import {formatISODate} from "../../utils/DateUtil";
import TpButtonList from "../common/button/TpButtonList";

export default function PostList() {
    const navigate = useNavigate();
    const [selectedCode, setSelectedCode] = useState<string>("");

    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 10;
    const [currentPosts, setCurrentPosts] = useState([]);
    const [totalPages, setTotalPages] = useState(0);

    const { data, error } = useQuery({
        queryKey: ["postId", selectedCode],
        queryFn: () => GetPostList(selectedCode),
        enabled: !!selectedCode, // selectedCode가 있을 때만 요청 실행
    });


    useEffect(() => {
        setCurrentPage(1); // 코드 변경 시 첫 페이지로 초기화
    }, [selectedCode]);

    useEffect(() => {
        if (data) {
            const indexOfLastPost = currentPage * postsPerPage;
            const indexOfFirstPost = indexOfLastPost - postsPerPage;
            setCurrentPosts(data.slice(indexOfFirstPost, indexOfLastPost));
            setTotalPages(Math.ceil(data.length / postsPerPage));
        }
    }, [currentPage]); // currentPage가 변경될 때도 업데이트 필요

    // 페이지 계산
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleWritePost = () => {
        alert("글쓰기 페이지로 이동합니다.");
        navigate('/post/write', {
            state : {
                    status: 'new',
                    postTp : selectedCode
                    },

        });
    };

    if(error) {
        return <div>게시글 목록을 불러오는 데 실패했습니다.</div>
    }
    return (
        <div className="max-w-4xl mx-auto mt-8 p-4 gap-2">
            {/* 헤더 */}
            <div className="flex justify-center items-center mb-6">
                <h1 className="text-2xl font-bold">커뮤니티</h1>
            </div>
            <div className="mb-4">
                <TpButtonList
                    code={'002'}
                    onSelect={setSelectedCode}
                />
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                {currentPosts?.map((post: {postId:string, title:string, creatorId:string, updatedAt:string, creator:{nickname:string}}) => (
                    <div
                        key={post.postId}
                        className="flex justify-between items-center px-4 py-2"
                    >
                        {post.postId}
                        <Link className="font-medium" to={`/post/${post.postId}`}>{post.title}</Link>
                        <div className="text-sm text-gray-500">
                            <span>{post.creator.nickname}</span>|<span>{formatISODate(post.updatedAt)}</span>
                        </div>
                    </div>
                ))}

                {currentPosts?.length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                        게시글이 없습니다.
                    </div>
                )}
            </div>

            {/* 페이지네이션 */}
            <PageNavigator currentPage={currentPage} totalPage={totalPages} handlePageChange={handlePageChange}/>
            <div className="flex justify-end">
                {
                    localStorage.getItem("refreshToken")
                    && <button
                        onClick={handleWritePost}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        글쓰기
                    </button>
                }
            </div>
        </div>
    );
}