import '@/app/(general)/ui/components/posts/post';

import { Metadata } from 'next';

import { SavedPostList } from '@/app/(general)/ui/components/posts/post_list_custom';
 
export const metadata: Metadata = {
  title: 'Saved Posts',
};

export default async function HomePage() {
  return (
    <main className="flex min-h-screen flex-col w-full">
      <div className="error flex flex-col w-full">
        <div className="flex flex-col border-0 border-border p-6 md:pt-12 bg-background/35 md:mt-0 lg:px-4">
          <h1 className="header">Your Saved Posts</h1>
          <p className='subtitle'>If you liked some post you saw, keep it here.</p>
        </div>
        <div className='flex flex-col lg:pb-12 lg:px-4 mb-6'>
          <SavedPostList />  
        </div>
      </div>
    </main>
  );
}
