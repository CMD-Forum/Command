import '@/app/(general)/ui/components/posts/post';
import PostList from '@/app/(general)/ui/components/posts/post_list';
import { SavedPostListByUserID } from '../../ui/components/posts/post_list_custom';
import { auth } from '@/auth';

export default async function HomePage() {

  const session = await auth();

  if (session?.user.id) {
    return (

      <main className="flex min-h-screen flex-col w-full">

        <div className="error flex flex-col w-full">

              <div className="flex flex-col border-0 border-border p-6 pt-12 lg:pb-12 lg:p-12 lg:px-48 bg-card">

                  <h1 className="header">Your Saved Posts</h1>
                  <p className='subtitle'>If you liked some post you saw, keep it here.</p>

              </div>

              <div className='flex flex-col px-6 lg:py-12 lg:px-48 mt-6 mb-6'>
                <SavedPostListByUserID userID={session?.user.id} />  
              </div>

          </div>

      </main>

    );    
  }


}
