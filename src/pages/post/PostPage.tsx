import React from "react";

import {useParams} from "react-router-dom";
import Post from "../../components/post/Post";

export default function PostPage() {
    const { postId } = useParams();

    return (
      <Post postId={Number(postId)}/>
    );
}