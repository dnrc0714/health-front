import React, {useEffect, useState} from "react"
import {useNavigate} from "react-router-dom";
import {GetPostList} from "../../services/post/PostService";
import PageNavigator from "../PageNavigator";

export default function PostList() {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 10;

    // 페이지 계산
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

    const totalPages = Math.ceil(posts.length / postsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleWritePost = () => {
        alert("글쓰기 페이지로 이동합니다.");
        navigate('/post/write', {
            state : {status: 'new'}
        });
    };

    useEffect(() => {
        const loadPosts = async () => {
            try {
                const data = await GetPostList();
                setPosts(data);
            } catch (error) {
                alert("게시글 목록을 불러오는 데 실패했습니다.");
            }
        }

        loadPosts();
    }, []);
    return (
        <div className="max-w-4xl mx-auto mt-8 p-4">
            {/* 헤더 */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">게시판</h1>
                <button
                    onClick={handleWritePost}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    글쓰기
                </button>
            </div>

            {/* 게시글 목록 */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                {currentPosts.map((post: {postId:string, title:string, creatorId:string, createdAt:string, creator:{nickname:string}}) => (
                    <div
                        key={post.postId}
                        className="flex justify-between items-center px-4 py-2 border-b"
                    >
                        {post.postId}
                        <span className="font-medium">{post.title}</span>
                        <div className="text-sm text-gray-500">
                            <span>{post.creator.nickname}</span> | <span>{post.createdAt}</span>
                        </div>
                    </div>
                ))}

                {currentPosts.length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                        게시글이 없습니다.
                    </div>
                )}
            </div>

            {/* 페이지네이션 */}
            <PageNavigator currentPage={currentPage} totalPage={totalPages} handlePageChange={handlePageChange}/>
        </div>
    );
}