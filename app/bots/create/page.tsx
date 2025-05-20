"use client"

import { useEffect, useState } from "react"
import { Suspense } from "react"
import dynamic from "next/dynamic"

// Create a loading component for the Suspense fallback
function Loading() {
  return <div className="flex items-center justify-center w-full h-screen">Loading...</div>
}

// Dynamically import the client component lazily
const CreateBotForm = dynamic(
  () => import('./page-client'),
  { loading: () => <Loading /> }
)

export default function CreateBotPage() {
  const [isMounted, setIsMounted] = useState(false)
  
  // This useEffect ensures we only render the client component
  // after the component has mounted on the client side
  useEffect(() => {
    setIsMounted(true)
  }, [])
  
  // Don't render anything during SSR
  if (!isMounted) {
    return <Loading />
  }
  
  return (
    <Suspense fallback={<Loading />}>
      <CreateBotForm />
    </Suspense>
  )
}
