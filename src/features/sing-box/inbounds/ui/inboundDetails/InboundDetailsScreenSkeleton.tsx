import { Card, Skeleton } from "@/shared/ui";

export function InboundDetailsScreenSkeleton() {
  return (
    <div className="space-y-4 pb-14">
      <Card className="gap-0 overflow-hidden border py-0">
        <div className="mx-auto w-full max-w-6xl px-6 py-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-52" />
              </div>
            </div>

            <div className="grid w-full gap-3 sm:grid-cols-2 xl:w-auto xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-background/80 rounded-xl border px-4 py-3 shadow-sm"
                >
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="mt-2 h-4 w-24" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Card className="gap-0 overflow-hidden py-0">
        <div className="mx-auto w-full max-w-6xl px-6 py-6">
          <div className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-64" />
          </div>

          <div className="mt-6 grid gap-4">
            {Array.from({ length: 2 }).map((_, index) => (
              <div
                key={index}
                className="bg-background rounded-xl border px-4 py-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="grid flex-1 grid-cols-5 gap-4">
                    {Array.from({ length: 5 }).map((__, innerIndex) => (
                      <div key={innerIndex} className="space-y-2">
                        <Skeleton className="h-3 w-14" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Skeleton className="h-9 w-24" />
                    <Skeleton className="h-9 w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card className="gap-0 overflow-hidden py-0">
        <div className="mx-auto w-full max-w-6xl px-6 py-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <Skeleton className="h-6 w-36" />
              <Skeleton className="h-4 w-72" />
            </div>

            <Skeleton className="h-9 w-40" />
          </div>

          <div className="mt-6 grid gap-4 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="bg-background rounded-2xl border p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="size-9 rounded-xl" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>

                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>

                <div className="mt-4 rounded-xl border px-4 py-3">
                  <div className="flex items-start gap-3">
                    <Skeleton className="size-8 rounded-lg" />
                    <div className="w-full space-y-2">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3.5 w-full" />
                      <Skeleton className="h-3.5 w-2/3" />
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid gap-2">
                  {Array.from({ length: 2 }).map((__, detailIndex) => (
                    <div
                      key={detailIndex}
                      className="rounded-lg border border-dashed px-3 py-2"
                    >
                      <Skeleton className="h-3.5 w-full" />
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between gap-3 border-t pt-4">
                  <Skeleton className="h-3 w-36" />
                  <Skeleton className="h-8 w-32" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card className="gap-0 overflow-hidden py-0">
        <div className="mx-auto max-w-3xl px-6 py-6">
          <div className="space-y-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-24 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-24 w-full" />
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="bg-background/95 fixed right-0 bottom-0 left-0 z-20 border-t backdrop-blur md:left-(--sidebar-width)">
        <div className="flex justify-end gap-2 px-6 py-4">
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-28" />
        </div>
      </div>
    </div>
  );
}
