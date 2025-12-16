'use client'

import { useEffect } from 'react'

export default function Error({
  error,
}: {
  error: string
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div>
      <h2>{error}</h2>

    </div>
  )
}