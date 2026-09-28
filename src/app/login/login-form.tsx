"use client"

import { Loader2Icon } from "lucide-react"
import { useActionState } from "react"

import { sendMagicLink, type LoginState } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const initialState: LoginState = { status: "idle" }

export function LoginForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState(sendMagicLink, initialState)

  if (state.status === "sent") {
    return (
      <p role="status" className="rounded-xl border p-4">
        {state.message}
      </p>
    )
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="next" value={next} />
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Work email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@company.com"
          className="h-11"
          aria-invalid={state.status === "error"}
          aria-describedby={state.status === "error" ? "email-error" : undefined}
        />
        {state.status === "error" && (
          <p id="email-error" className="text-destructive text-sm">
            {state.message}
          </p>
        )}
      </div>
      <Button type="submit" className="h-11 font-semibold" disabled={pending}>
        {pending && <Loader2Icon className="animate-spin" aria-hidden />}
        Email me a sign-in link
      </Button>
    </form>
  )
}
