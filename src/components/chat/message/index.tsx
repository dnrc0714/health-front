import {Ref} from "react";
import { motion } from "framer-motion";
import InfiniteScroll from "react-infinite-scroll-component";
import React from "react";
import {ChatMessageType} from "../../../types/chatMessageType";
import Input from "../../common/Input";
import Button from "../../common/button/Button";
import {UserType} from "../../../types/userType";
import { X } from "lucide-react"; // Lucide 아이콘 사용 (Tailwind와 잘 어울림)


interface ChatMessageListProps{
    messagesEndRef: Ref<HTMLDivElement>;
    messages: ChatMessageType[];
    fetchMessages: ()=> Promise<void>;
    hasMore: boolean;
    newMessage: string;
    sendMessage: () => void;
    setNewMessage: (value: string) => void;
    loginUser: UserType | null;
    isDropdownOpen: boolean;
    handleDropdown: () => void;
    handleFileChange: React.ChangeEventHandler<HTMLInputElement>;
    previews:string[];
    videoFile:File | null;
    otherFile:File | null;
    disabled?: boolean
    handleRemoveImage?: (index: number) => void;
    handleFileUpload: () => void;
}

export default function ChatMessageList({messagesEndRef, messages, fetchMessages, hasMore, newMessage,
                                            sendMessage, setNewMessage, loginUser, isDropdownOpen, handleDropdown,
                                            handleFileChange, previews, videoFile, otherFile, disabled, handleRemoveImage, handleFileUpload}: ChatMessageListProps) {
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault(); // 폼 제출 시 페이지 리로드 방지
                // handleLogin(); //
            }}
        >
            <div id="scrollableDiv" className="p-4 bg-gray-100 rounded-lg shadow-lg h-96 overflow-y-auto" ref={messagesEndRef}>
                <InfiniteScroll
                    dataLength={messages.length}
                    next={fetchMessages}
                    className={"flex-col"}
                    hasMore={hasMore}
                    loader={<h4>Loading...</h4>}
                    inverse={true} // 스크롤을 위로 올릴 때 데이터 로드
                    scrollableTarget="scrollableDiv"
                >
                    {messages.map((msg, idx) => (
                        <div key={msg.id ?? `fallback-${idx}`} className={`flex my-2 ${msg.creator?.userId === loginUser?.userId ? "justify-end" : "justify-start"}`}>
                            <div className="flex flex-col">
                                <span className={`flex ${msg.creator?.userId === loginUser?.userId ? "justify-end" : "justify-start"}`}>{msg.creator?.nickname}</span>
                                <span className={`p-2 rounded-lg max-w-xs text-white ${
                                    msg.creator?.userId === loginUser?.userId ? "bg-blue-600" : "bg-gray-500"
                                }`}
                                >
                                    {msg.content}
                                </span>
                            </div>
                        </div>
                    ))}
                </InfiniteScroll>
            </div>
            <div className="flex mt-4 gap-1">
                <Button label={"+"} type={"button"} className={"file-add-btn"} onClick={handleDropdown}/>
                <Input type={"text"} id={"msg"} name={"msg"} value={newMessage} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewMessage(e.target.value)} className={"input-text"} disabled={disabled}/>
                {/*파일 있을때, 버튼 분기처리 해야함*/}
                {(previews.length > 0 || videoFile || otherFile) ?
                    <Button label={"Send"} onClick={handleFileUpload} className={"apply-btn-flex"}/>
                :<Button label={"Send"} onClick={sendMessage} className={"apply-btn-flex"}/>
                }
            </div>
            {isDropdownOpen ?
                (previews.length > 0 || videoFile || otherFile) ?
                (
                    <div className="mt-2 p-2 rounded-lg ">
                        <div className="mb-2 flex flex-wrap gap-2">
                            {previews?.map((src, index) => (
                                <div key={index} className="relative w-32 h-32">
                                    <img src={src} alt={`preview-${index}`} className="w-full h-full object-cover rounded-lg" />
                                    <button
                                        className="absolute top-1 right-1 bg-gray-700 text-white rounded-full p-1 hover:bg-red-600 transition"
                                        onClick={() => handleRemoveImage?.(index)}
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ))}
                            {videoFile && <video src={URL.createObjectURL(videoFile)} controls className="w-40 h-40"></video>}
                            {otherFile && <p>{otherFile.name}</p>}
                        </div>
                    </div>
                ) :
                (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className="relative w-full mt-2 bg-white shadow-lg rounded-lg flex justify-between"
                >
                    <label className="p-2 font-bold cursor-pointer text-lg text-center w-full rounded-lg hover:bg-gray-100">
                        📷 사진
                        <Input type={"file"} id={"img"} name={"img"} accept={"image/*"} className={"hidden"} onChange={handleFileChange} multiple={true}/>
                    </label>
                    <label className="p-2 font-bold cursor-pointer text-lg text-center w-full rounded-lg hover:bg-gray-100">
                        🎥 동영상
                        <Input type={"file"} id={"video"} name={"video"} accept={"video/*"} className={"hidden"} onChange={() => {console.log('영상업로드')}}/>
                    </label>
                    <label className="p-2 font-bold cursor-pointer text-lg text-center w-full rounded-lg hover:bg-gray-100">
                        📁 파일
                        <Input type={"file"} id={"file"} name={"file"} className={"hidden"} onChange={() => {console.log('파일업로드')}}/>
                    </label>
                </motion.div>
            ) : <></>}
        </form>
    );
}