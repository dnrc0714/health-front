import {useEffect, useState} from "react";
import React from "react";
import ChatRoomList from "../../../components/chat/room";
import {ChatRoom} from "../../../types/chatRootType";
import {getRoomList, fetchRoomList} from "../../../services/chat/RoomService";


export default function CharRoomPage() {
    const [chatRoomList, setChatRoomList] = useState<ChatRoom[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        const loadChatRoomHistory = async () => {
            try {
                const response = await getRoomList();
                const chatRoomList: ChatRoom[] = response.data.data.messageList.map((item: any) => {
                    return { roomId: item.roomId } as ChatRoom;
                });
                setChatRoomList(chatRoomList);
                setHasMore(chatRoomList.length > 0);
            } catch (error) {
                console.error("채팅 내역 로드 실패", error);
            }
        };
        loadChatRoomHistory();
    }, []);

    const fetchData = async () => {
        // 현재 페이지 번호를 사용하여 서버에 다음 페이지 데이터 요청
        const response = await fetchRoomList(currentPage);
        // 데이터를 기존 리스트에 추가
        const nextChatRoomList: ChatRoom[] = response.data.data.messageList.map((item: any) => {
            return { roomId: item.roomId } as ChatRoom;
        });
        setChatRoomList([...chatRoomList, ...nextChatRoomList]);
        setCurrentPage((prev)=> prev+1);
        setHasMore(nextChatRoomList.length > 0);
    };
    return (
        <div className="ChatRoomPage flex">
            <ChatRoomList chatRoomList={chatRoomList} fetchData={fetchData} hasMore={hasMore}/>
        </div>
    );
}