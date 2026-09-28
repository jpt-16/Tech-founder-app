import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function ProjectNotFound() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
      <span className="eyebrow">404</span>
      <h1 className="font-display text-3xl font-bold">Project not found</h1>
      <p className="text-muted-foreground">
        It doesn&apos;t exist, or your account hasn&apos;t been added to the organisation that owns it.
      </p>
      <Button asChild className="h-11">
        <Link href="/dashboard">Back to projects</Link>
      </Button>
    </main>
  )
}
