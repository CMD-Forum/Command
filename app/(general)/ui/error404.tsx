import { HomeIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'

export function Error404() {
  return (
      <div className="error flex flex-col gap-4 justify-center w-full mt-auto mb-auto">
            <div className="error flex flex-col gap-4 justify-center w-full">

                <div className="flex flex-col text-center">
                    <h1 className="text-3xl font-sans font-bold antialiased w-full">Sorry, we couldn&apos;t find that page.</h1>
                    <p className="text-gray-300 font-bold antialiased w-full">Make sure the link is correct.</p>   
                </div>

                <div className="flex flex-row justify-center gap-2 w-full">
                    <Link className='navlink' href='/'><HomeIcon className="font-medium h-5 w-5" />Home</Link>
                    <Link className='navlink' href='/search'><MagnifyingGlassIcon className="font-medium h-5 w-5" />Search</Link>    
                </div> 
                
            </div>
        </div>
  )
}
