import { Post } from '@/types';
import { FC } from 'react'

interface PostOverviewProps {
    post: Post;
}


const PostOverview: FC<PostOverviewProps> = ({ post }) => {
  return <h2>{post.title}</h2>
}

export default PostOverview