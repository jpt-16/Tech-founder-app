"use client"

import { Loader2Icon, PlusIcon } from "lucide-react"
import { startTransition, useActionState, useEffect, useRef, useState } from "react"
import { toast } from "sonner"

import {
  submitFeatureRequest,
  type FeatureRequestState,
} from "@/app/dashboard/[projectId]/actions"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const PRIORITIES = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
] as const

const initialState: FeatureRequestState = { status: "idle" }

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} className="text-destructive text-sm">
      {message}
    </p>
  )
}

export function FeatureRequestDialog({
  projectId,
  defaultRequester,
}: {
  projectId: string
  defaultRequester?: string | null
}) {
  const [open, setOpen] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const [state, formAction, pending] = useActionState(
    submitFeatureRequest.bind(null, projectId),
    initialState,
  )

  useEffect(() => {
    if (state.status === "success") {
      toast.success("Request submitted", { description: "It's now at the top of the backlog triage." })
      formRef.current?.reset()
      setOpen(false)
    } else if (state.status === "error" && state.message && !state.fieldErrors) {
      toast.error(state.message)
    }
  }, [state])

  const errors = state.status === "error" ? state.fieldErrors ?? {} : {}

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-11 px-4 font-semibold">
          <PlusIcon aria-hidden /> New request
        </Button>
      </DialogTrigger>
      <DialogContent className="gap-6 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">New feature request</DialogTitle>
          <DialogDescription>
            Describe the outcome you need. It lands in the backlog for scoping.
          </DialogDescription>
        </DialogHeader>

        <form
          ref={formRef}
          // Submit via onSubmit (not `action`) so React doesn't auto-reset the
          // form when validation fails; it's reset manually on success.
          onSubmit={(e) => {
            e.preventDefault()
            const data = new FormData(e.currentTarget)
            startTransition(() => formAction(data))
          }}
          className="flex flex-col gap-5"
          noValidate
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="fr-title">Title</Label>
            <Input
              id="fr-title"
              name="title"
              required
              minLength={3}
              maxLength={140}
              placeholder="e.g. Apple sign-in on onboarding"
              className="h-11"
              aria-invalid={Boolean(errors.title)}
              aria-describedby={errors.title ? "fr-title-error" : undefined}
            />
            <FieldError id="fr-title-error" message={errors.title} />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="fr-description">Description</Label>
            <Textarea
              id="fr-description"
              name="description"
              rows={4}
              maxLength={4000}
              placeholder="What should it do, who is it for, and how will we know it works?"
              aria-invalid={Boolean(errors.description)}
              aria-describedby={errors.description ? "fr-description-error" : undefined}
            />
            <FieldError id="fr-description-error" message={errors.description} />
          </div>

          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 text-sm font-medium">Priority</legend>
            <div className="grid grid-cols-3 gap-2">
              {PRIORITIES.map((p) => (
                <label key={p.value} className="relative">
                  <input
                    type="radio"
                    name="priority"
                    value={p.value}
                    defaultChecked={p.value === "medium"}
                    className="peer sr-only"
                  />
                  <span
                    className={cn(
                      "border-input bg-background flex h-11 cursor-pointer items-center justify-center rounded-md border text-sm font-medium transition-colors",
                      "hover:bg-accent peer-checked:border-primary peer-checked:bg-primary peer-checked:text-primary-foreground peer-checked:font-semibold",
                      "peer-focus-visible:ring-ring/50 peer-focus-visible:ring-[3px]",
                    )}
                  >
                    {p.label}
                  </span>
                </label>
              ))}
            </div>
            <FieldError id="fr-priority-error" message={errors.priority} />
          </fieldset>

          <div className="flex flex-col gap-2">
            <Label htmlFor="fr-requested-by">Requested by</Label>
            <Input
              id="fr-requested-by"
              name="requestedBy"
              maxLength={200}
              defaultValue={defaultRequester ?? ""}
              placeholder="you@company.com"
              className="h-11"
              aria-invalid={Boolean(errors.requestedBy)}
            />
            <FieldError id="fr-requested-by-error" message={errors.requestedBy} />
          </div>

          {state.status === "error" && state.fieldErrors && state.message && (
            <p role="alert" className="text-destructive text-sm">
              {state.message}
            </p>
          )}

          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button type="button" variant="outline" className="h-11">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" className="h-11 font-semibold" disabled={pending}>
              {pending && <Loader2Icon className="animate-spin" aria-hidden />}
              Submit request
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
