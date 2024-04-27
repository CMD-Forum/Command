import Link from "next/link";

export default function AboutPage() {

    return (

        <main className="flex min-h-screen flex-col w-full">

            <div className="error flex flex-col w-full">
  
              <div className="flex flex-col border-b-1 border-border p-6 pt-12 lg:pb-12 lg:p-12 lg:px-48">
  
                  <h1 className="header">About CMD/&gt;</h1>
  
              </div>
  
              <div className='flex flex-col px-6 lg:py-12 lg:px-48 mt-6 mb-6'>
                <p>Sorry, this page hasn&apos;t been completed yet.</p>
                <Link href={"/"} className="hover:underline w-fit">Go Home</Link>
              </div>
  
          </div>
  
      </main>
    );

}