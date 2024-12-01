"use client";

import { Community, Post } from "@prisma/client";
import { useEffect,useState } from 'react';

import { 
  getCommunityById,
  getCommunitySidebarInfo,
  getPost
} from "../../lib/data";
import CommunitySideInfobar from "../../ui/components/navigation/community_infobar";
import { FullPost } from '../../ui/components/posts/post';
import { Error404 } from "../../ui/error404";
import { FullPostSkeleton } from "../../ui/skeletons/Post";

export default function PostView({ params }: { params: { id: string } }) {

  const [post, setPost] = useState<Post>();
  const [community, setCommunity] = useState<Community>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {

      setLoading(true);

      if ( ! params.id ) {
        setLoading(false);
        return <Error404 />;
      }

      const fetchedPost = await getPost({ postID: params.id });

      if ( ! fetchedPost) {
        setLoading(false);
        return <Error404 />;
      }

      const fetchedCommunity = await getCommunitySidebarInfo({ communityID: fetchedPost.communityId });

      if ( !fetchedCommunity ) {
        setLoading(false);
        return <Error404 />
      }

      setCommunity(fetchedCommunity);
      setPost(fetchedPost);
      setLoading(false);
    }

    fetchData();
  }, [params.id, post?.communityId]);

  return (
      <div className="flex h-full justify-between">
        <div className='flex flex-col lg:pb-12 px-4 mb-6 w-full'>
          {loading ? (
            <FullPostSkeleton />
          ) : post ? (
            <>
              <FullPost
                id={post.id}
                title={post.title}
                // @ts-ignore
                author={post.author}
                // @ts-ignore
                community={post.community}
                createdAt={post.createdAt}
                updatedAt={post.updatedAt}
                public={post.public}
                content={post.content}
                imageurl={post.imageurl}
                imagealt={post.imagealt}
                href={post.href}
              />          
            </>
          ) : (
            <>
              <Error404 />
            </>
          )}
        </div>
        { community &&
          <CommunitySideInfobar community={community} />
        }
      </div>
  );
}
