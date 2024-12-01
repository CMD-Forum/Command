"use client";

import { ArrowTrendingDownIcon, ArrowTrendingUpIcon, ChartBarIcon, ChatBubbleLeftEllipsisIcon, ChevronLeftIcon, ChevronRightIcon, ClockIcon, FireIcon, PencilSquareIcon, ViewColumnsIcon } from '@heroicons/react/16/solid';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect,useState } from 'react';

import { useSession } from '@/app/(general)/lib/sessioncontext';
import { CardPost } from '@/app/(general)/ui/components/posts/post';
import { Post } from '@/types/types';

import { CardPostSkeleton } from '../../skeletons/Post';
import Select, { SelectContent } from '../select/select';
import { Option } from '../select/select';

/**
 * PostListByUser
 * Lists all posts by a specific user.
 * @param username
 */

export default function PostListByUser( { username }: { username: string } ) {

    const [page, setPage] = useState(0);
    const [totalPosts, setTotalPosts] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageForwardAllowed, setPageForwardAllowed] = useState<boolean>(true);

    const [sort, setSort] = useState<string>("Hot");
    const [view, setView] = useState<string>("Normal");

    const [posts, setPosts] = useState<Post>();
    const [isLoading, setIsLoading] = useState<Boolean>(false);

    function nextPage() {
        setPageForwardAllowed(false);
        if (page < totalPages - 1) {
            setPage(page + 1);
            setPageForwardAllowed(true);
        }
    }
    function lastPage() {
        if ( page > 0 ) {
            setPage(page - 1);
            setPageForwardAllowed(true);
        }
    }    

    const router = useRouter();

    try {
        useEffect(() => {
            setIsLoading(true),
            fetch("/api/posts/getAll/byUsername", {
                method: 'POST',
                headers:{
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ "page": `${page}`, "username": `${username}`, "sort": `${sort}` })
            })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                setPosts(data.posts);
                setTotalPosts(data.postCount);
                setTotalPages(Math.ceil(totalPosts / 10))
                setIsLoading(false);
            });
        }, [username, page, totalPosts, sort]);
    } catch ( error ) {
        return (
            <div className='flex flex-col items-center justify-center w-full relative group transition-all bg-card h-[174px] rounded-lg px-5 py-5'>
                <p className='text-center text-gray-300 font-medium antialiased w-full'>Sorry, an error occurred.</p>
                <div className='flex gap-4 w-full items-center justify-center mt-4'>
                    <button className='navlink' onClick={() => router.refresh()} type='button'>Reload</button>
                </div>
            </div>            
        );
    }  

    if ( isLoading ) {
        return (
            <div className='flex flex-col gap-4 mt-4'>
                <CardPostSkeleton />
                <CardPostSkeleton />
                <CardPostSkeleton />
                <CardPostSkeleton />
                <CardPostSkeleton />
                <CardPostSkeleton />
                <CardPostSkeleton />
                <CardPostSkeleton />
                <CardPostSkeleton />
                <CardPostSkeleton />           
            </div>
        );
    }

    if ( totalPages <= 0 ) { // Tried `if ( ! posts )` but that didn't work for some reason.
        return (
            <div className='flex flex-col items-center justify-center w-full relative group transition-all bg-card h-[174px] rounded-lg px-5 py-5'>
                <p className='text-center text-gray-300 font-medium antialiased w-full'>Looks like there&apos;s no posts here.</p>
                <div className='flex gap-4 w-full items-center justify-center mt-4'>
                    <Link className='navlink' href={"/"}>Home</Link>
                </div>
            </div>
        );
    }

    return (
        <div className='flex flex-col'>
            <div className='flex gap-2 mb-2'>
                <div className='flex flex-col pl-6 lg:px-0'>
                    <div className='flex items-center gap-1 text-gray-300 mb-1'>
                        <ChartBarIcon className='w-4 h-4' />
                        <p>Sort</p>    
                    </div>
                    <Select onSelect={setSort} defaultLabel={sort}>
                        <SelectContent>
                            <Option label="Hot" icon={<FireIcon />} />
                            <Option label="New" icon={<PencilSquareIcon />} />
                            <Option label="Old" icon={<ClockIcon />} />
                            <Option label="Top" icon={<ArrowTrendingUpIcon />} />
                            <Option label="Controversial" icon={<ArrowTrendingDownIcon />} />
                            <Option label="Comments" icon={<ChatBubbleLeftEllipsisIcon />} />
                        </SelectContent>
                    </Select>                
                </div>
                <div className='flex flex-col'>
                    <div className='flex items-center gap-1 text-gray-300 mb-1'>
                        <ViewColumnsIcon className='w-4 h-4' />
                        <p>View</p>    
                    </div>
                    <Select onSelect={setView} defaultLabel={view} disabled={true}>
                        <SelectContent>
                            <Option label="Normal" />
                            <Option label="Card" />
                        </SelectContent>
                    </Select>
                </div>
                <div className='flex flex-col'>
                    <div className='flex items-center gap-1 text-gray-300 mb-1'>
                        <ViewColumnsIcon className='w-4 h-4' />
                        <p>View</p>    
                    </div>
                    <Select onSelect={setView} defaultLabel={view} disabled={true}>
                        <SelectContent>
                            <Option label="Normal" />
                            <Option label="Card" />
                        </SelectContent>
                    </Select>                
                </div>
            </div>
            <div className='flex flex-col gap-2'>
                {Array.isArray(posts) && posts.map((post) => {
                    return (
                        <div 
                        key={post.id}
                        >
                        <CardPost 
                            id={post.id}
                            createdAt={new Date(post.createdAt)}
                            updatedAt={new Date(post.updatedAt)}
                            title={post.title}
                            content={post.content}
                            tagline={post.tagline}
                            imageurl={post.imageurl}
                            imagealt={post.imagealt}
                            public={true}
                            authorId={post.author.id}
                            communityId={post.community.id}
                            author={post.author}
                            community={post.community}
                            href={post.href}
                        />
                        </div>
                    );
                })}                
            </div>
            <div className='flex gap-4 items-center px-6 mt-5'>
                <button onClick={() => lastPage()} className='navlink !px-2' disabled={ page === 0 ? true : false } aria-label='Last Page'><ChevronLeftIcon className='w-5 h-5' /></button>  
                <p className='subtitle h-fit'>{ page + 1 } of { totalPages || "1" }</p>
                <button onClick={() => nextPage()} className='navlink !px-2' disabled={ !pageForwardAllowed || page === totalPages - 1 } aria-label='Next Page'><ChevronRightIcon className='w-5 h-5' /></button>            
            </div>
        </div>
    );

}

// By Community

export function PostListByCommunity( { communityID }: { communityID: string } ) {

    const [page, setPage] = useState(0);
    const [totalPosts, setTotalPosts] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [pageForwardAllowed, setPageForwardAllowed] = useState<boolean>(true);

    const [sort, setSort] = useState<string>("Hot");
    const [view, setView] = useState<string>("Normal");

    const [posts, setPosts] = useState<Post>();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    function nextPage() {
        setPageForwardAllowed(false);
        if (page < totalPages - 1) {
            setPage(page + 1);
            setPageForwardAllowed(true);
        }
    }
    function lastPage() {
        if ( page > 0 ) {
            setPage(page - 1);
            setPageForwardAllowed(true);
        }
    }    

    const router = useRouter();

    try {
        useEffect(() => {
            setIsLoading(true),
            fetch("/api/posts/getAll/byCommunityID", {
                method: 'POST',
                headers:{
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ "page": `${page}`, "communityID": `${communityID}`, "sort": `${sort}` })
            })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                setPosts(data.posts);
                setTotalPosts(data.post_count);
                setTotalPages(Math.ceil(totalPosts / 10))
                setIsLoading(false);
            });
        }, [communityID, page, sort, totalPosts]);
    } catch ( error ) {
        return (
            <div className='flex flex-col items-center justify-center w-full relative group transition-all bg-card h-[174px] rounded-lg px-5 py-5'>
                <p className='text-center text-gray-300 font-medium antialiased w-full'>Sorry, an error occurred.</p>
                <div className='flex gap-4 w-full items-center justify-center mt-4'>
                    <button className='navlink' onClick={() => router.refresh()} type='button'>Reload</button>
                </div>
            </div>            
        );
    }  

    if ( isLoading ) {
        return (
            <div className='flex flex-col gap-4 mt-4'>
                <CardPostSkeleton />
                <CardPostSkeleton />
                <CardPostSkeleton />
                <CardPostSkeleton />
                <CardPostSkeleton />
                <CardPostSkeleton />
                <CardPostSkeleton />
                <CardPostSkeleton />
                <CardPostSkeleton />
                <CardPostSkeleton />
            </div>
        );
    }

    if ( totalPages <= 0 ) { // Tried `if ( ! posts )` but that didn't work for some reason.
        return (
            <div className='flex flex-col items-center justify-center w-full relative group transition-all bg-card h-[174px] rounded-lg px-5 py-5'>
                <p className='text-center text-gray-300 font-medium antialiased w-full'>Looks like there&apos;s no posts here.</p>
                <div className='flex gap-4 w-full items-center justify-center mt-4'>
                    <Link className='navlink' href={"/"}>Home</Link>
                </div>
            </div>  
        );
    }

    return (
        <div className='flex flex-col'>
            <div className='flex gap-2 mb-2'>
                <div className='flex flex-col pl-6 lg:px-0'>
                    <div className='flex items-center gap-1 text-gray-300 mb-1'>
                        <ChartBarIcon className='w-4 h-4' />
                        <p>Sort</p>    
                    </div>
                    <Select onSelect={setSort} defaultLabel={sort}>
                        <SelectContent>
                            <Option label="Hot" icon={<FireIcon />} />
                            <Option label="New" icon={<PencilSquareIcon />} />
                            <Option label="Old" icon={<ClockIcon />} />
                            <Option label="Top" icon={<ArrowTrendingUpIcon />} />
                            <Option label="Controversial" icon={<ArrowTrendingDownIcon />} />
                            <Option label="Comments" icon={<ChatBubbleLeftEllipsisIcon />} />
                        </SelectContent>
                    </Select>
                </div>
                <div className='flex flex-col'>
                    <div className='flex items-center gap-1 text-gray-300 mb-1'>
                        <ViewColumnsIcon className='w-4 h-4' />
                        <p>View</p>    
                    </div>
                    <Select onSelect={setView} defaultLabel={view} disabled={true}>
                        <SelectContent>
                            <Option label="Normal" />
                            <Option label="Card" />
                        </SelectContent>
                    </Select>                
                </div>
            </div>
            <div className='flex flex-col gap-2'>
                {Array.isArray(posts) && posts.map((post) => {
                    return (
                        <div 
                        key={post.id}
                        >
                        <CardPost 
                            id={post.id}
                            createdAt={new Date(post.createdAt)}
                            updatedAt={new Date(post.updatedAt)}
                            title={post.title}
                            content={post.content}
                            tagline={post.tagline}
                            imageurl={post.imageurl}
                            imagealt={post.imagealt}
                            public={true}
                            authorId={post.author.id}
                            communityId={post.community.id}
                            author={post.author}
                            community={post.community}
                            href={post.href}
                        />
                        </div>
                    );
                })}                
            </div>
            <div className='flex gap-4 items-center px-6 mt-5'>
                <button onClick={() => lastPage()} className='navlink !px-2' disabled={ page === 0 ? true : false } aria-label='Last Page'><ChevronLeftIcon className='w-5 h-5' /></button>  
                <p className='subtitle h-fit'>{ page + 1 } of { totalPages || "1" }</p>
                <button onClick={() => nextPage()} className='navlink !px-2' disabled={ !pageForwardAllowed || page === totalPages - 1 } aria-label='Next Page'><ChevronRightIcon className='w-5 h-5' /></button>            
            </div>
        </div>
    );
}

// SavedBy UserID

export function SavedPostList() {

    const [page, setPage] = useState(0);
    const [totalPosts, setTotalPosts] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageForwardAllowed, setPageForwardAllowed] = useState<boolean>(true);

    const [sort, setSort] = useState<string>("Hot");
    const [view, setView] = useState<string>("Normal");

    const [posts, setPosts] = useState<Post>();
    const [isLoading, setIsLoading] = useState(false);

    const session = useSession();

    function nextPage() {
        setPageForwardAllowed(false);
        if (page < totalPages - 1) {
            setPage(page + 1);
            setPageForwardAllowed(true);
        }
    }
    function lastPage() {
        if ( page > 0 ) {
            setPage(page - 1);
            setPageForwardAllowed(true);
        }
    }    

    try {        
        useEffect(() => {
            setIsLoading(true),
            fetch("/api/posts/getAllSaved/byUserID", {
                method: 'POST',
                headers:{
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session.session?.id}`,
                },
                body: JSON.stringify({ "page": `${page}`, "userID": `${session.user?.id}`, "sort": `${sort}` })
            })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                setPosts(data.savedPosts);
                setTotalPosts(data.postCount);
                setTotalPages(Math.ceil(totalPosts / 10))
                setIsLoading(false);
            });
        }, [page, totalPosts, session.user?.id, session.session?.id, sort]);
    } catch ( error ) {
        return (
            <div className='flex flex-col items-center justify-center w-full relative group transition-all bg-card h-[174px] rounded-lg px-5 py-5'>
                <p className='text-center text-gray-300 font-medium antialiased w-full'>Sorry, an error occurred.</p>
                {/*<div className='flex gap-4 w-full items-center justify-center mt-4'>
                    <button className='navlink' onClick={() => router.refresh()} type='button'>Reload</button>
                </div>*/}
            </div>            
        );
    }  

    if ( isLoading ) {
        return (
            <div className='flex flex-col gap-4 mt-4'>
                <CardPostSkeleton />
                <CardPostSkeleton />
                <CardPostSkeleton />
                <CardPostSkeleton />
                <CardPostSkeleton />
                <CardPostSkeleton />
                <CardPostSkeleton />
                <CardPostSkeleton />
                <CardPostSkeleton />
                <CardPostSkeleton />    
            </div>
        );
    }

    if ( totalPosts <= 0 ) { // Tried `if ( ! posts )` but that didn't work for some reason.
        return (
            <div className='flex flex-col items-center justify-center w-full relative group transition-all bg-card h-[174px] rounded-lg px-5 py-5'>
                <p className='text-center text-gray-300 font-medium antialiased w-full'>Looks like there&apos;s no posts here.</p>
                <div className='flex gap-4 w-full items-center justify-center mt-4'>
                    <Link className='navlink' href={"/"}>Home</Link>
                </div>
            </div>  
        );
    }

    return (
        <div className='flex flex-col'>
            <div className='flex gap-2 mb-2'>
                <div className='flex flex-col pl-6 lg:px-0'>
                    <div className='flex items-center gap-1 text-gray-300 mb-1'>
                        <ChartBarIcon className='w-4 h-4' />
                        <p>Sort</p>    
                    </div>
                    <Select onSelect={setSort} defaultLabel={sort}>
                        <SelectContent>
                            <Option label="Hot" icon={<FireIcon />} />
                            <Option label="New" icon={<PencilSquareIcon />} />
                            <Option label="Old" icon={<ClockIcon />} />
                            <Option label="Top" icon={<ArrowTrendingUpIcon />} />
                            <Option label="Controversial" icon={<ArrowTrendingDownIcon />} />
                            <Option label="Comments" icon={<ChatBubbleLeftEllipsisIcon />} />
                        </SelectContent>
                    </Select>
                </div>
                <div className='flex flex-col'>
                    <div className='flex items-center gap-1 text-gray-300 mb-1'>
                        <ViewColumnsIcon className='w-4 h-4' />
                        <p>View</p>    
                    </div>
                    <Select onSelect={setView} defaultLabel={view} disabled={true}>
                        <SelectContent>
                            <Option label="Normal" />
                            <Option label="Card" />
                        </SelectContent>
                    </Select>                
                </div>
            </div>
            <div className='flex flex-col gap-2'>
                {Array.isArray(posts) && posts.map((post) => {
                    return (
                        <div 
                        key={post.id}
                        >
                        <CardPost 
                            id={post.id}
                            createdAt={new Date(post.createdAt)}
                            updatedAt={new Date(post.updatedAt)}
                            title={post.title}
                            content={post.content}
                            tagline={post.tagline}
                            imageurl={post.imageurl}
                            imagealt={post.imagealt}
                            public={true}
                            authorId={post.author.id}
                            communityId={post.community.id}
                            author={post.author}
                            community={post.community}
                            href={post.href}
                        />
                        </div>
                    );
                })}                
            </div>
            <div className='flex gap-4 items-center px-6 mt-5'>
                <button onClick={() => lastPage()} className='navlink !px-2' disabled={ page === 0 ? true : false } aria-label='Last Page'><ChevronLeftIcon className='w-5 h-5' /></button>  
                <p className='subtitle h-fit'>{ page + 1 } of { totalPages || "1" }</p>
                <button onClick={() => nextPage()} className='navlink !px-2' disabled={ !pageForwardAllowed || page === totalPages - 1 } aria-label='Next Page'><ChevronRightIcon className='w-5 h-5' /></button>            
            </div>
        </div>
    );
}

// WithCustomData

export function PostListCustomData({ data }: { data: any }) {

    const [page, setPage] = useState(0);
    const [totalPosts, setTotalPosts] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageForwardAllowed, setPageForwardAllowed] = useState<boolean>(true);

    const [sort, setSort] = useState<string>("Hot");
    const [view, setView] = useState<string>("Normal");

    const [posts, setPosts] = useState<Post>();
    const [isLoading, setIsLoading] = useState(false);

    function nextPage() {
        setPageForwardAllowed(false);
        if (page < totalPages - 1) {
            setPage(page + 1);
            setPageForwardAllowed(true);
        }
    }
    function lastPage() {
        if ( page > 0 ) {
            setPage(page - 1);
            setPageForwardAllowed(true);
        }
    }    

    try {        
        useEffect(() => {
            setIsLoading(true),
            /*fetch("/api/posts/getAllSaved/byUserID", {
                method: 'POST',
                headers:{
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session.session?.id}`,
                },
                body: JSON.stringify({ "page": `${page}`, "userID": `${session.user?.id}`, "sort": `${sort}` })
            })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                setPosts(data.savedPosts);
                setTotalPosts(data.postCount);
                setTotalPages(Math.ceil(totalPosts / 10))
                setIsLoading(false);
            });*/
            setPosts(data)
            setTotalPosts(data.postCount)
            setTotalPages(Math.ceil(totalPosts / 10))
            setIsLoading(false)
        }, [page, totalPosts, sort, data]);
    } catch ( error ) {
        return (
            <div className='flex flex-col items-center justify-center w-full relative group transition-all bg-card h-[174px] rounded-lg px-5 py-5'>
                <p className='text-center text-gray-300 font-medium antialiased w-full'>Sorry, an error occurred.</p>
                {/*<div className='flex gap-4 w-full items-center justify-center mt-4'>
                    <button className='navlink' onClick={() => router.refresh()} type='button'>Reload</button>
                </div>*/}
            </div>            
        );
    }  

    if ( isLoading ) {
        return (
            <div className='flex flex-col gap-4 mt-4'>
                <CardPostSkeleton />
                <CardPostSkeleton />
                <CardPostSkeleton />
                <CardPostSkeleton />
                <CardPostSkeleton />
                <CardPostSkeleton />
                <CardPostSkeleton />
                <CardPostSkeleton />
                <CardPostSkeleton />
                <CardPostSkeleton />    
            </div>
        );
    }

    if ( totalPosts <= 0 ) { // Tried `if ( ! posts )` but that didn't work for some reason.
        return (
            <div className='flex flex-col items-center justify-center w-full relative group transition-all bg-card h-[174px] rounded-lg px-5 py-5'>
                <p className='text-center text-gray-300 font-medium antialiased w-full'>Looks like there&apos;s no posts here.</p>
                <div className='flex gap-4 w-full items-center justify-center mt-4'>
                    <Link className='navlink' href={"/"}>Home</Link>
                </div>
            </div>  
        );
    }

    return (
        <div className='flex flex-col'>
            <div className='flex gap-2 mb-2'>
                <div className='flex flex-col pl-6 lg:px-0'>
                    <div className='flex items-center gap-1 text-gray-300 mb-1'>
                        <ChartBarIcon className='w-4 h-4' />
                        <p>Sort</p>    
                    </div>
                    <Select onSelect={setSort} defaultLabel={sort} disabled={true}>
                        <SelectContent>
                            <Option label="Hot" icon={<FireIcon />} />
                            <Option label="New" icon={<PencilSquareIcon />} />
                            <Option label="Old" icon={<ClockIcon />} />
                            <Option label="Top" icon={<ArrowTrendingUpIcon />} />
                            <Option label="Controversial" icon={<ArrowTrendingDownIcon />} />
                            <Option label="Comments" icon={<ChatBubbleLeftEllipsisIcon />} />
                        </SelectContent>
                    </Select>
                </div>
                <div className='flex flex-col'>
                    <div className='flex items-center gap-1 text-gray-300 mb-1'>
                        <ViewColumnsIcon className='w-4 h-4' />
                        <p>View</p>    
                    </div>
                    <Select onSelect={setView} defaultLabel={view} disabled={true}>
                        <SelectContent>
                            <Option label="Normal" />
                            <Option label="Card" />
                        </SelectContent>
                    </Select>                
                </div>
            </div>
            <div className='flex flex-col gap-2'>
                {Array.isArray(posts) && posts.map((post) => {
                    return (
                        <div 
                        key={post.id}
                        >
                        <CardPost 
                            id={post.id}
                            createdAt={new Date(post.createdAt)}
                            updatedAt={new Date(post.updatedAt)}
                            title={post.title}
                            content={post.content}
                            tagline={post.tagline}
                            imageurl={post.imageurl}
                            imagealt={post.imagealt}
                            public={true}
                            authorId={post.author.id}
                            communityId={post.community.id}
                            author={post.author}
                            community={post.community}
                            href={post.href}
                        />
                        </div>
                    );
                })}                
            </div>
            <div className='flex gap-4 items-center mt-5'>
                <button onClick={() => lastPage()} className='navlink !px-2' disabled={ page === 0 ? true : false } aria-label='Last Page'><ChevronLeftIcon className='w-5 h-5' /></button>  
                <p className='subtitle h-fit'>{ page + 1 } of { totalPages || "1" }</p>
                <button onClick={() => nextPage()} className='navlink !px-2' disabled={ !pageForwardAllowed || page === totalPages - 1 } aria-label='Next Page'><ChevronRightIcon className='w-5 h-5' /></button>            
            </div>
        </div>
    );
}