"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="p-4">
      <p className="mb-2">Error: {error.message}</p>
      <button className="border px-3 py-1" onClick={reset}>
        Retry
      </button>
    </div>
  );
}
