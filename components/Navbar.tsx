'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { redirect, useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'


const Navbar = () => {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;
  return (
     <header className='navbar'>
    <nav>
      <Link href="/">
      <Image src="/assets/icons/logo.svg" alt="Logo" width={32} height={32} />
      <h1>Sceevi</h1>
      </Link>

      {user && (

        <figure>
            <button onClick={() => router.push(`/profile/${user?.id}`)}>
                <Image className='rounded-full aspect-square' src={user.image || ''} alt='user' width={36} height={36}/>
            </button>
            
            <button onClick={async () => {
                return await authClient.signOut({
                  fetchOptions: {
                    onSuccess: () => {
                      redirect("/sign-in");
                    },
                  },
                });
              }}
              className="cursor-pointer">
                <Image className='rounded-full rotate-180' src="/assets/icons/logout.svg" alt='logout' width={24} height={24}/>
            </button>
        </figure>
      )}
    </nav>
   </header>
  )
}

export default Navbar
