import { ArrowTrendingUpIcon, BoltIcon, ChartBarIcon, MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/solid';
import { Metadata } from 'next';
import Link from 'next/link';

import Menu, { MenuContent, MenuLink, MenuTrigger } from '../ui/components/menu/menu';
import SearchBar from '../ui/components/search/searchbar';
import SearchResults from '../ui/components/search/searchresults';
 
export const metadata: Metadata = {
  title: 'Search',
};

export default function Search({
    searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
    type?: string;
  };
}) {

    const query = searchParams?.query || '';
    // eslint-disable-next-line no-unused-vars
    const type = searchParams?.type || 'post';
    const currentPage = Number(searchParams?.page) || 1;

    return (
      <div className='min-h-dvh'>
            <div className="flex flex-col border-0 border-border p-6 md:pt-12 bg-background/35 md:mt-0 lg:px-4">
                <h1 className="header">Search</h1>
                <p className="subtitle">Find that post you liked.</p>   
            </div>
            <div className='flex flex-row mb-4 px-4 gap-2'>
                <SearchBar />   
                <div className='flex flex-row gap-2'>
                    <Link className={"navlink-full !px-2 lg:!px-3"} href={"/create"}><PlusIcon className={"w-5 h-5"} /><span className='hidden lg:flex'>Create</span></Link>                    
                </div>             
            </div>

            <div className='flex flex-col gap-4 px-6 mb-4'>
                {query ?
                    <SearchResults query={query} currentPage={currentPage} type={"post"} />
                :
                    null
                }
            </div>
        </div>
    )
}