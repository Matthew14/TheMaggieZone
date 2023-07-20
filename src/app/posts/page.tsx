import PostOverview from "@/components/PostOverview";
import { Post } from "@/types";
import React from "react";

const posts: Post[] = [{title: 'A sample post', date: new Date()}, {title: 'another post', date: new Date()}];

const Page: React.FC = () => {
  return (
    <>
        { posts.map(post => <PostOverview key={post.title} post={post} /> ) }
    </>
  );
};

export default Page;
