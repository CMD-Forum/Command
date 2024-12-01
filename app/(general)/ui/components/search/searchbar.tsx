"use client";

import { MagnifyingGlassIcon } from '@heroicons/react/16/solid';
import { usePathname, useRouter,useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export default function SearchBar() {

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term) => {

    const params = new URLSearchParams(searchParams);

    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }

    // @ts-ignore
    replace(`${pathname}?${params.toString()}`);

  }, 1000);

  return (
    <div className='flex items-center justify-center w-full'>
        <div className='flex flex-row w-full relative'>
            <MagnifyingGlassIcon className='flex absolute w-5 h-5 left-2 top-2 !border-r-0 text-gray-300 peer-focus:!text-white' />
            <input 
              className='peer flex flex-row items-center w-full !pl-8'
              placeholder='Search'
              onChange={(e) => {
                handleSearch(e.target.value);
              }}
              defaultValue={searchParams.get('query')?.toString()}
            />
        </div>
    </div>
  );
}