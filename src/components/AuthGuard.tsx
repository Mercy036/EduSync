'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/src/lib/firebase"
import { Spinner } from "@/src/components/ui/spinner"

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/")
      } else {
        setLoading(false)
      }
    })

    return () => unsub()
  }, [router])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 p-6">
        <Spinner />
        <p className="text-muted-foreground animate-pulse">Verifying User</p>
      </div>
    )
  }

  return <>{children}</>
}