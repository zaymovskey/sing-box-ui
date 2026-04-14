import { Card, Separator, Skeleton } from "@/shared/ui";

export function SecurityAssetsTableScreenSkeleton() {
  return (
    <Card className="mb-4 gap-5 p-4">
      <Separator />

      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-10 w-[400px]" />

        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-28" />
        </div>
      </div>

      <div className="overflow-hidden rounded-md border">
        <div className="border-b px-2 py-2">
          <div className="grid grid-cols-[1.4fr_120px_1.2fr_140px] gap-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-5 w-full" />
            ))}
          </div>
        </div>

        <div className="divide-y">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="px-2 py-3">
              <div className="grid grid-cols-[1.4fr_120px_1.2fr_140px] items-center gap-3">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-5 w-32" />
                <div className="flex justify-end gap-2">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
    </Card>
  );
}
