// // app/page.tsx
// 'use client';

// import { useAuth } from '@/contexts/auth-context';
// import { LoginForm } from '@/components/auth/login-form';
// import { useEffect } from 'react';
// import { useRouter } from 'next/navigation';

// export default function Home() {
//   const { isAuthenticated, isLoading } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     if (isAuthenticated && !isLoading) {
//       router.push('/admin');
//     }
//   }, [isAuthenticated, isLoading, router]);

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   return <LoginForm />;
// }

import React from 'react'

const page = () => {
  return (
    <div>
      
    </div>
  )
}

export default page
