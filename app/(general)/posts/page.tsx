import '@/app/(general)/ui/components/posts/post';

import { Metadata } from 'next';

import PostList from '@/app/(general)/ui/components/posts/post_list';

import Alert, { AlertSubtitle, AlertTitle } from '../ui/components/new_alert';
 
export const metadata: Metadata = {
  title: 'Posts',
};

export default async function HomePage() {

  return (
    <main className="flex min-h-screen flex-col w-full">
      <div className="error flex flex-col w-full">
            <div className="flex flex-col border-0 border-border p-6 md:pt-12 bg-background/35 md:mt-0 lg:px-4">
                <h1 className="header">Posts</h1>
            </div>
            <div className='flex flex-col lg:pb-12 lg:px-4 mb-6'>
              <div className='px-6 lg:px-0'>
                  <Alert type={"alert"} style={"subtle"} className={"mb-4"} closeBtn={false}>
                      <AlertTitle>Here be dragons!</AlertTitle>
                      <AlertSubtitle>This is a development version of Command - some things may not work as expected or may be unfinished.</AlertSubtitle>
                  </Alert>
              </div>
              <div className='px-6 lg:px-0'>
                <PostList />   
              </div>
            </div>
        </div>
    </main>
  );
}
