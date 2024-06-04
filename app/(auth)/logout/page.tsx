import { signOut } from "@/auth"
import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: 'Logout - CMD',
};

export default function SignOutPage() {
  return (
    <div className="p-6 pt-12 lg:pb-12 lg:p-12 lg:px-48">
      <div className='flex flex-col items-center justify-center w-full relative group transition-all bg-card h-[174px] rounded-md px-5 py-5'>
        <p className='text-center !text-white font-medium antialiased w-full'>Are you sure you want to sign out?</p>
        <form
          action={async (formData) => {
            "use server"
            await signOut();
          }}
          className=""
        >
          <button type="submit" className="navlink-emphasis mt-4">Sign out</button>
        </form>
      </div>            
    </div>
  )
}