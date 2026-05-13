export function PetCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-border/50">
      <div className="aspect-square skeleton" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-16 skeleton" />
        <div className="h-4 w-3/4 skeleton" />
        <div className="h-3 w-1/2 skeleton" />
        <div className="flex justify-between items-center">
          <div className="h-6 w-20 skeleton" />
          <div className="h-8 w-24 rounded-full skeleton" />
        </div>
      </div>
    </div>
  );
}

export function PetGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <PetCardSkeleton key={i} />
      ))}
    </div>
  );
}
