import React from "react";

export default function MainContent() {
    return (
        <main className="p-6">
            <section className="mb-8">
                <h2 className="text-3xl font-bold mb-4">커뮤니티 게시판</h2>
                <p className="text-gray-700">
                    건강 관련 정보를 공유하고 소통할 수 있는 공간입니다.<br/>
                    <a href="/post" className="text-blue-500 hover:underline">
                        게시판 바로가기
                    </a>
                </p>
            </section>
            <section>
                <h2 className="text-3xl font-bold mb-4">운동 일정</h2>
                <p className="text-gray-700">
                    자신만의 운동 루틴을 계획하고 다른 사람들과 공유해 보세요. <br/>
                    <a href="/schedule" className="text-blue-500 hover:underline">
                        운동 일정 바로가기
                    </a>
                </p>
            </section>
        </main>
    );
}
//