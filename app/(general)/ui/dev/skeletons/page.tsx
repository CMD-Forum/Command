import { prisma } from "@/app/(general)/lib/db";

import ProfileMain from "../../components/account/ProfileMain";
import { CardPost, FullPost } from "../../components/posts/post";
import { ProfileMainSkeleton } from "../../skeletons/Account";
import { CardPostSkeleton, FullPostSkeleton } from "../../skeletons/Post";

export default async function SkeletonPage() {

    const post = await prisma.post.findFirst({
        include: {
          community: {
            select: {
              id: true,
              display_name: true,
              name: true,
              image: true,
              public: true,
              description: true,
            }
          },
          author: {
            select: {
              id: true,
              username: true,
              description: true,
              image: true,
              createdAt: true,
              updatedAt: true,
            }
          }
        }
    })

    return (

        <main className="flex min-h-screen flex-col w-full">

        <div className="error flex flex-col w-full">

                <div className="flex flex-col border-0 border-border p-6 pt-12 lg:pb-12 lg:p-12 lg:px-48 bg-card mt-8 md:mt-0">
                    <h1 className="header">Skeletons</h1>
                </div>

                <div className='flex flex-col px-6 lg:py-12 lg:px-48 mt-6 mb-6'>
                    <div>
                        <p className="subtitle">FullPost</p>   
                        { post 
                        ? 
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
                            />    
                        :
                            null                     
                        }
                        <hr />
                        <FullPostSkeleton />
                    </div>

                    <div>
                        <p className="subtitle mt-4 mb-4">CardPost</p>
                        { post 
                        ?
                            <CardPost 
                                id={post.id}
                                title={post.title}
                                author={post.author}
                                // @ts-ignore
                                community={post.community}
                                createdAt={post.createdAt}
                                updatedAt={post.updatedAt}
                                public={post.public}
                                content={post.content}
                                imageurl={post.imageurl}
                                imagealt={post.imagealt}
                            />
                        :
                            null
                        }
                        <hr className="mt-6 mb-6" />
                        <CardPostSkeleton />
                    </div>

                    <div>
                        <p className="subtitle mt-4 mb-4">ProfileMain</p>
                        { post 
                        ?
                            <ProfileMain 
                                username={post.author.username} 
                                image={post.author.image} 
                                description={post.author.description} 
                                createdAt={post.author.createdAt} 
                                postCount={0} 
                            />
                        :
                            null
                        }
                        <hr className="mt-6 mb-6" />
                        <ProfileMainSkeleton />
                    </div>
                </div>

            </div>

        </main>

    );
}
