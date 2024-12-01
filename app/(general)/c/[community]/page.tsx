import { Metadata } from "next";
import { notFound } from 'next/navigation';

import { prisma } from "@/app/(general)/lib/db";

import { CommunityInfobar } from "../../ui/components/nav_sideitem";
import { PostListByCommunity } from "../../ui/components/posts/post_list_custom";
import CommunitySideInfobar from "../../ui/components/navigation/community_infobar";
 
export async function generateMetadata(
  { params }: { params: { community: string } },
): Promise<Metadata> {
  const name = params.community.toLowerCase()
  return {
    title: name ? `c/${name}` : "CMD/>",
  }
}

export default async function CommunityPage({ params }: { params: { community: string } }) {

  const dbCommunity = await prisma.community.findUnique({ 
    where: { 
      name: params.community.toLowerCase() 
    },
    include: {
      admins: {
        select: {
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              username: true,
              description: true,
              image: true,
            },
          },
        },
      },
    },
  });

  if ( ! dbCommunity ) {
    return notFound();
  }

  return (
    <div className="flex">
      <main className="flex min-h-fit flex-col w-full">   
        <div className="flex flex-col border-0 border-border p-6 md:pt-12 bg-background/35 md:mt-0 lg:px-4">
          <CommunityInfobar 
            community={dbCommunity} 
          />      
        </div>
        <div className='flex flex-col lg:pb-12 lg:px-4 mb-6 bg-background/35'>
          <PostListByCommunity communityID={dbCommunity.id} />
        </div>
      </main>
      <CommunitySideInfobar community={dbCommunity} />
    </div>
  );    
}
