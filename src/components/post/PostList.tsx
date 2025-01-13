import React, {useState} from "react"
import {useNavigate} from "react-router-dom";

export default function PostList() {
    const navigate = useNavigate();

    const response = async () => {
    }
    const [posts, setPosts] = useState([
        { id: 1, title: "첫 번째 게시글", author: "Alice", date: "2025-01-10" },
        // { id: 2, title: "두 번째 게시글", author: "Bob", date: "2025-01-09" },
        // { id: 3, title: "세 번째 게시글", author: "Charlie", date: "2025-01-08" },
        // { id: 4, title: "세 번째 게시글", author: "Charlie", date: "2025-01-08" },
        // { id: 5, title: "세 번째 게시글", author: "Charlie", date: "2025-01-08" },
        // { id: 6, title: "세 번째 게시글", author: "Charlie", date: "2025-01-08" },
        // { id: 7, title: "세 번째 게시글", author: "Charlie", date: "2025-01-08" },
        // { id: 8, title: "세 번째 게시글", author: "Charlie", date: "2025-01-08" },
        // { id: 9, title: "세 번째 게시글", author: "Charlie", date: "2025-01-08" },
        // { id: 10, title: "세 번째 게시글", author: "Charlie", date: "2025-01-08" },
        // { id: 11, title: "세 번째 게시글", author: "Charlie", date: "2025-01-08" },
        // { id: 12, title: "세 번째 게시글", author: "Charlie", date: "2025-01-08" },
        // { id: 13, title: "세 번째 게시글", author: "Charlie", date: "2025-01-08" },
    ]);

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
        navigate('/post/write');
    };


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
                {currentPosts.map((post) => (
                    <div
                        key={post.id}
                        className="flex justify-between items-center px-4 py-2 border-b"
                    >
                        <span className="font-medium">{post.title}</span>
                        <div className="text-sm text-gray-500">
                            <span>{post.author}</span> | <span>{post.date}</span>
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
            <div className="flex justify-center mt-4 fixed bottom-1/4 left-0 w-full">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        className={`px-4 py-2 mx-1 rounded ${
                            currentPage === index + 1
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-700"
                        }`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}