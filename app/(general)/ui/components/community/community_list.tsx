"use client";

import { CardPost } from '@/app/(general)/ui/components/posts/post';
import { useState, useEffect } from 'react';
import { getAllCommunitys, getAllPostsFromCommunityID, getAllPostsFromUsername } from '@/app/(general)/lib/data';
import { Post } from '@/types/types';
import { useRouter } from 'next/navigation';
import { Community } from '@prisma/client';
import { CardCommunity } from './community';

export function CommunityList() {
    const [loading, setIsLoading] = useState<boolean>(true);
    const [communitys, setCommunitys] = useState<Community[]>([]);

    const router = useRouter();

    useEffect(() => {
        const fetchCommunitys = async () => {
            setIsLoading(true);
            try {
                const data = await getAllCommunitys();
                // @ts-ignore
                setCommunitys(data);
                setIsLoading(false);                
            } catch (error) {
                return (
                    <div className='flex flex-col items-center justify-center w-full relative group transition-all bg-card h-[174px] rounded-md px-5 py-5'>
                        <p className='text-center text-gray-300 font-medium antialiased w-full'>Sorry, an error occurred.</p>
                        <div className='flex gap-4 w-full items-center justify-center mt-4'>
                        <button className='navlink' onClick={() => router.refresh()} type='button'>Reload</button>
                        </div>
                    </div>
                );
            } finally {
                setIsLoading(false);
            }

        };
        fetchCommunitys();
    }, [router])

    if ( loading ) {
        return (
            <div className='flex flex-col gap-4 mt-4'>
                <div className='flex w-full relative group transition-all bg-border h-[174px] rounded-md px-5 py-5 animate-pulse'></div>    
                <div className='flex w-full relative group transition-all bg-border h-[174px] rounded-md px-5 py-5 animate-pulse'></div>
                <div className='flex w-full relative group transition-all bg-border h-[174px] rounded-md px-5 py-5 animate-pulse'></div>
                <div className='flex w-full relative group transition-all bg-border h-[174px] rounded-md px-5 py-5 animate-pulse'></div>
                <div className='flex w-full relative group transition-all bg-border h-[174px] rounded-md px-5 py-5 animate-pulse'></div>
                <div className='flex w-full relative group transition-all bg-border h-[174px] rounded-md px-5 py-5 animate-pulse'></div>
                <div className='flex w-full relative group transition-all bg-border h-[174px] rounded-md px-5 py-5 animate-pulse'></div>   
                <div className='flex w-full relative group transition-all bg-border h-[174px] rounded-md px-5 py-5 animate-pulse'></div>       
                <div className='flex w-full relative group transition-all bg-border h-[174px] rounded-md px-5 py-5 animate-pulse'></div>
                <div className='flex w-full relative group transition-all bg-border h-[174px] rounded-md px-5 py-5 animate-pulse'></div>        
            </div>
        );
    }

    return (
        <div className='flex flex-col gap-4'>
            {Array.isArray(communitys) && (communitys.length > 0 ? communitys.map((community) => (
                <CardCommunity community={community} key={community.id} />
            )) : (
                <div className='flex flex-col items-center justify-center w-full relative group transition-all bg-card h-[174px] rounded-md px-5 py-5'>
                    <p className='text-center text-gray-300 font-medium antialiased w-full'>Looks like there&apos;s no communitys yet.</p>
                    <div className='flex gap-4 w-full items-center justify-center mt-4'>
                        <button className='navlink' onClick={() => router.push("/posts")} type='button'>Go Home</button>
                    </div>
                </div>
            ))}
        </div>
    );
}