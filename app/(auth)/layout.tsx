import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/app/(general)/globals.scss'
import { Navigation, Sidebar, Infobar, Bottombar } from '@/app/(general)/ui/navigation'
import NextAuthProvider from '@/app/(general)/nextauthprovider'

const inter = Inter({ subsets: ['latin'] })

export default async function RootLayout({

  children,

}: {

  children: React.ReactNode

}) {

  return (

    <NextAuthProvider>

      <html lang="en" className={`defaultTheme facebookTheme:font-facebook_link ${inter.className}`}>

        <head>

          <link rel='shortcut icon' href='/images/favicon/favicon.ico' />

        </head>

        <body className=' facebookTheme:bg-white text-white facebookTheme:text-black overflow-scroll overflow-x-hidden h-full relative'>

          <div className='bg-zinc-950 w-full'>
            <Navigation />  
          </div>
          
          <div className='flex justify-center m-auto bg-[url("/images/uploaded/code.png")] bg-[#0c0c0e] facebookTheme:bg-white items-center min-h-dvh w-full p-6 lg:p-12'>

              {children}    

          </div>

        </body>

      </html>

    </NextAuthProvider>

  )
}
