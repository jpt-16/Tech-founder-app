export default function Loading() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 pt-28 sm:px-8" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading project…</span>
      <div className="bg-muted h-4 w-24 animate-pulse rounded" />
      <div className="bg-muted h-12 w-2/3 max-w-lg animate-pulse rounded-lg" />
      <div className="bg-muted h-12 w-full animate-pulse rounded-lg" />
      <div className="bg-muted h-[480px] w-full animate-pulse rounded-xl" />
    </div>
  )
}
