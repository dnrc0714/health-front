import React from "react";

type PageNavigatorProps = {
    currentPage : number;
    totalPage : number;
    handlePageChange : (page: number) => void;
}
export default function PageNavigator({currentPage, totalPage, handlePageChange}:PageNavigatorProps ) {

    return (
        <div className="flex justify-center mt-4 bottom-1/4 left-0 w-full">
            {Array.from({ length: totalPage }, (_, index) => (
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
    );
}