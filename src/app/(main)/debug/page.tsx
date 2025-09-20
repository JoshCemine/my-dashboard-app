"use client"
import { useSession } from 'next-auth/react'
import React from 'react'

export default function page() {
    const { data: session } = useSession()
    const temp = session ? session.user : null
    return (
        <div>page {temp?.email}</div>
    )
}
