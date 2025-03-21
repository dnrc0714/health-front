import { useCallback, useEffect, useRef, useState } from "react";
import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import "./ChatComponent.css";
import React from "react";
import ChatMessageList from "../../../components/chat/message";
import {getMessageList} from "../../../services/chat/MessageService";

interface ChatMessageRequest {
    from: string;
    text: string;
    roomId: number;
}
interface ChatMessageResponse {
    id: number;
    content: string;
    writer: string;
}

export default function ChatMessagePage() {
    const { roomId } = useParams();
    const [loading, setLoading] = useState(true);
    const [stompClient, setStompClient] = useState<Client | null>(null);
    const [messages, setMessages] = useState<ChatMessageResponse[]>([]);
    const [writer, setWriter] = useState<string>("");
    const [newMessage, setNewMessage] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // 초기 메시지 로드 함수
    const loadInitChatMessages = useCallback(async () => {
        try {
            const response = await getMessageList(roomId as string);
            const responseMessages = response.data.data as ChatMessageResponse[];
            setMessages(responseMessages);
            setHasMore(responseMessages.length > 0);
            setLoading(false);
        } catch (error) {
            console.error("채팅 내역 로드 실패", error);
        }
    }, [roomId]);

    const socket = new SockJS(import.meta.env.VITE_WEBSOCKET_URL as string);
    const client = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000,
        onConnect: () => {
            client.subscribe(
                `/topic/public/rooms/${roomId}`,
                (message: IMessage) => {
                    const msg: ChatMessageResponse = JSON.parse(message.body);
                    setMessages((prevMessages) => [msg, ...prevMessages]);
                }
            );
        },
    });

    useEffect(() => {
        if(loading){
            loadInitChatMessages();
        }
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            onConnect: () => {
                client.subscribe(
                    `/topic/public/rooms/${roomId}`,
                    (message: IMessage) => {
                        const msg: ChatMessageResponse = JSON.parse(message.body);
                        setMessages((prevMessages) => [msg, ...prevMessages]);
                    }
                );
            },
        });

        client.activate();
        setStompClient(client);
        return () => {
            client.deactivate();
        };
    }, [currentPage, loadInitChatMessages, loading, roomId]);

    // 채팅 메시지 로드
    const fetchMessages = async () => {
        try {
            const response = await getMessageList(roomId as string);
            const responseMessages = response.data.data as ChatMessageResponse[];
            setMessages((prevMessages) => [...prevMessages, ...responseMessages]);
            setCurrentPage((prev) => prev + 1);
            setHasMore(responseMessages.length > 0);
            scrollToBottom();
        } catch (error) {
            console.error("채팅 내역 로드 실패", error);
        }
    };

    // 메시지 전송
    const sendMessage = () => {
        if (stompClient && newMessage) {
            const chatMessage: ChatMessageRequest = {
                from: writer,
                text: newMessage,
                roomId: parseInt(roomId || ""),
            };
            stompClient.publish({
                destination: `/pub/chat/rooms/${roomId}/send`,
                body: JSON.stringify(chatMessage),
            });
            setNewMessage(""); // 메시지 전송 후 입력 필드 초기화
        }
    };

    return (
        <div className="chat-container">
            <div>
                <Link to={"/rooms"} className="back-link">
                    뒤로 가기
                </Link>
            </div>
            <ChatMessageList
                messagesEndRef={messagesEndRef}
                messages={messages}
                fetchMessages={fetchMessages}
                hasMore={hasMore}
                writer={writer}
                newMessage={newMessage}
                sendMessage={sendMessage}
                setWriter={setWriter}
                setNewMessage={setNewMessage}
            />
        </div>
    );
}