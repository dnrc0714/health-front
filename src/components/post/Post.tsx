import React from "react"

type PostProps = {
    postId : number;
}
export default function Post({postId}:PostProps) {
    return <div>{postId}</div>
}