import { useCallback, useEffect, useRef, useState } from "react";
import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { Link, useParams } from "react-router-dom";
import "./ChatComponent.css";
import React from "react";
import ChatMessageList from "../../../components/chat/message";
import {getMessageInitList, getMessageList} from "../../../services/chat/MessageService";
import {ChatMessageType} from "../../../types/chatMessageType";
import {UserType} from "../../../types/userType";
import {getLoggedUser} from "../../../utils/JwtUtil";
import {ChatFileType} from "../../../types/chatFileType";
import {saveFile} from "../../../services/chat/ChatFileService";
import {debounce} from "lodash";
import {useMutation} from "@tanstack/react-query";
import {CircularProgress, circularProgressClasses} from "@mui/material";

interface ChatMessageRequest {
    from: string;
    content: string;
    files: File[] | null;
    file: File | null;
    roomId: number;
    type: string;
}

export default function ChatMessagePage() {
    const { roomId } = useParams();
    const [loading, setLoading] = useState(true);
    const [stompClient, setStompClient] = useState<Client | null>(null);
    const [messages, setMessages] = useState<ChatMessageType[]>([]);
    const [newMessage, setNewMessage] = useState<string>("");
    const currentPageRef = useRef(1);
    const isFetchingRef = useRef(false);
    const [hasMore, setHasMore] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isAutoScroll, setIsAutoScroll] = useState(true);
    const [loginUser, setLoginUser] = useState<UserType | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [otherFile, setOtherFile] = useState<File | null>(null);
    const [previews, setPreviews] = useState<string[]>([]);
    const [fileType, setFileType] = useState<string>("001");
    const [disabled, setDisabled] = useState<boolean>();

    const handleScroll = debounce(() => {
        const div = messagesEndRef.current;
        if (!div) return;
        if (div.scrollTop < 50 && hasMore) {
            const prevScrollHeight = div.scrollHeight;

            fetchMessages().then(() => {
                // fetch 후 scroll 위치 보정
                setTimeout(() => {
                    if (div) {
                        const newScrollHeight = div.scrollHeight;
                        div.scrollTop = newScrollHeight - prevScrollHeight + div.scrollTop;
                    }
                }, 0);
            });
        }

        setIsAutoScroll(div.scrollTop + div.clientHeight >= div.scrollHeight - 10);
    }, 200);

    useEffect(() => {
        if (isAutoScroll && messagesEndRef.current) {
            messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        const div = messagesEndRef.current;
        const refreshToken = localStorage.getItem("refreshToken") as string;
        const decodedToken = getLoggedUser(refreshToken);
        if(decodedToken !== undefined) {
            setLoginUser(decodedToken);
        }

        if (div) {
            div.addEventListener("scroll", handleScroll);
            return () => div.removeEventListener("scroll", handleScroll);
        }
    }, []);

    // 초기 메시지 로드 함수
    const loadInitChatMessages = useCallback(async () => {
        try {
            const response = await getMessageInitList(roomId as string);
            const responseMessages = response.data.data as ChatMessageType[];
            setMessages(responseMessages.reverse());
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
        connectHeaders: {
            // JWT 토큰이나 세션 ID 등 인증 정보 추가
            'Authorization': `Bearer ${localStorage.getItem("refreshToken")}` // 액세스 토큰 사용
        },
        onConnect: () => {
            client.subscribe(
                `/topic/public/rooms/${roomId}`,
                (message: IMessage) => {
                    const msg: ChatMessageType = JSON.parse(message.body);
                    setMessages((prevMessages) => [...prevMessages, msg]);
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
            connectHeaders: {
                // JWT 토큰이나 세션 ID 등 인증 정보 추가
                'Authorization': `Bearer ${localStorage.getItem("refreshToken")}` // 액세스 토큰 사용
            },
            onConnect: () => {
                client.subscribe(
                    `/topic/public/rooms/${roomId}`,
                    (message: IMessage) => {
                        const msg: ChatMessageType = JSON.parse(message.body);
                        setMessages((prevMessages) => [...prevMessages, msg]);
                    }
                );
            },
        });

        client.activate();
        setStompClient(client);
        return () => {
            client.deactivate();
        };
    }, [loadInitChatMessages, loading, roomId]);


    const fetchMessages: () => Promise<boolean> = useCallback(async () => {
        if (isFetchingRef.current) return false;
        isFetchingRef.current = true;

        try {
            const response = await getMessageList(roomId as string, currentPageRef.current);
            const responseMessages = response.data.data as ChatMessageType[];

            if (responseMessages.length === 0) {
                setHasMore(false);
                return false;
            }

            currentPageRef.current += 1;
            setMessages((prevMessages) => [...responseMessages.reverse(), ...prevMessages]);
            setHasMore(true);
            return true;
        } catch (error) {
            console.error("채팅 내역 로드 실패", error);
            return false;
        } finally {
            isFetchingRef.current = false;
        }
    }, [roomId]);

    // 메시지 전송
    const sendMessage = () => {
        console.log("-----SEND MESSAGE-----");
        if (stompClient) {
            const chatMessage: ChatMessageRequest = {
                from: localStorage.getItem("refreshToken") as string,
                content: newMessage,
                files: imageFiles,
                file: videoFile ?? otherFile ?? null,
                roomId: parseInt(roomId || ""),
                type: fileType
            };

            stompClient.publish({
                destination: `/pub/chat/rooms/${roomId}/send`,
                body: JSON.stringify(chatMessage),
                // 필요한 경우 추가 헤더 설정
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("refreshToken")}`
                }
            });

            setNewMessage("");
            setImageFiles([]);
            setPreviews([]);
            setVideoFile(null);
            setOtherFile(null);
        }
    };

    // 파일 선택 핸들러
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        let newImages: File[] = [];
        let newPreviews: string[] = [];
        let newVideo: File | null = videoFile;
        let newOther: File | null = otherFile;
        let type = "001";

        for (let file of files) {
            if (file.type.startsWith("image/")) {
                type = "002";
                if (imageFiles.length + newImages.length < 10) {
                    newImages.push(file);
                    newPreviews.push(URL.createObjectURL(file));
                } else {
                    alert("이미지는 10개까지 저장 가능합니다.");
                    return;
                }
            } else if (file.type.startsWith("video/")) {
                type = "003";
                if (!newVideo) newVideo = file;
            } else {
                type = "004";
                if (!newOther) newOther = file;
            }
        }

        setImageFiles([...imageFiles, ...newImages]);
        setPreviews([...previews, ...newPreviews]);
        setVideoFile(newVideo);
        setOtherFile(newOther);
        setFileType(type);
        setDisabled(true);
    };

    const handleFileUploadMutation = useMutation({
        mutationFn: async () => {
            const chatFiles = {
                roomId: Number(roomId),
                files: imageFiles,
                file: videoFile ?? otherFile,
                type: fileType
            };
            await saveFile(chatFiles); // 파일 업로드 API 호출
        },
        onMutate: () => {
            setIsLoading(true); // 로딩 상태 시작
            <CircularProgress/>
        },
        onSuccess: () => {
            setIsLoading(false); // 성공하면 로딩 종료
            fetchMessages(); // 메시지 fetch
            // 상태 초기화
            setNewMessage("");
            setImageFiles([]);
            setPreviews([]);
            setVideoFile(null);
            setOtherFile(null);
        },
        onError: () => {
            setIsLoading(false); // 오류가 발생하면 로딩 종료
            alert("파일 업로드에 실패했습니다.");
        }
    });

    const handleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
        if(isDropdownOpen && (imageFiles.length > 0 && previews?.length > 0)) {
            setPreviews([]);
            setImageFiles([]);
            setDisabled(true);
        } else {
            setDisabled(false);
        }
        setDisabled(false);
    }

    const handleRemoveImage = (index: number) => {
        const updatedPreviews = previews.filter((_, i) => i !== index);
        const updatedImages = imageFiles.filter((_, i) => i !== index);
        setPreviews(updatedPreviews);
        setImageFiles(updatedImages);

        // 만약 previews 배열이 비어있으면 disabled를 false로 설정
        if (updatedPreviews.length === 0 && updatedImages.length === 0) {
            setDisabled(false);
        }
    };

    return (
        <div className="chat-container">
            <div>
                <Link to={"/rooms"} className="back-link">
                    뒤로 가기
                </Link>
            </div>
            {
                handleFileUploadMutation.isPending ?
                    <CircularProgress/> :
                    <ChatMessageList
                        messagesEndRef={messagesEndRef}
                        messages={messages}
                        fetchMessages={fetchMessages}
                        hasMore={hasMore}
                        newMessage={newMessage}
                        sendMessage={sendMessage}
                        setNewMessage={setNewMessage}
                        loginUser={loginUser}
                        isDropdownOpen={isDropdownOpen}
                        handleDropdown={handleDropdown}
                        handleFileChange={handleFileChange}
                        handleFileUpload={handleFileUploadMutation.mutate}
                        previews={previews}
                        videoFile={videoFile}
                        otherFile={otherFile}
                        disabled={disabled}
                        handleRemoveImage={handleRemoveImage}
                    />
            }
        </div>
    );
}