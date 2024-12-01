import { Metadata } from "next";

import { prisma } from "@/app/(general)/lib/db";
import ProfileMain from "@/app/(general)/ui/components/account/ProfileMain";

import PostListByUser from "../../ui/components/posts/post_list_custom";
import { Error404 } from "../../ui/error404";
 
export async function generateMetadata(
  { params }: { params: { name: string } },
): Promise<Metadata> {
  return {
    title: params.name ? `@${params.name}` : "",
  }
}

export default async function UserPage({ params }: { params: { name: string } }) {

    const user = await prisma.user.findUnique({
        where: {
          username: params.name,
        },
    });

    if ( user ) {

        const user_post_count = await prisma.post.count({
            where: {
                authorId: user.id
            }
        })
        
        return (
          <main className="flex min-h-screen flex-col w-full">
            <div className="error flex flex-col w-full">
              <div className="flex flex-col border-0 border-border p-6 md:pt-12 bg-background/35 md:mt-0 lg:px-4">
                <ProfileMain 
                  username={user.username} 
                  image={user.image} 
                  description={user.description} 
                  createdAt={user.createdAt} 
                  postCount={user_post_count} 
                />        
              </div>
              <div className='flex flex-col lg:pb-12 lg:px-4 mb-6'>
                <PostListByUser username={user.username} /> 
              </div>
            </div>
          </main>
        )

    } else if ( ! user || user === null || user === false ) {
        return (
          <Error404 />
        );
    }

}