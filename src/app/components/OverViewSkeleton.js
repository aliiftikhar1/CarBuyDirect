export default function OverviewSkeleton() {
    return (
      <div className="space-y-8 mb-4">
        {/* Added Services Skeleton */}
        <div className="bg-gray-100 md:p-4 p-2 rounded-lg">
          <Skeleton variant="text" width={150} height={24} />
          <div className="grid md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, index) => (
              <div key={index}>
                <Skeleton variant="text" width={180} height={20} />
                <Skeleton variant="text" width={120} height={16} />
              </div>
            ))}
          </div>
        </div>
  
        {/* Vehicle Details Skeleton */}
        <div className="text-sm md:text-base">
          <Skeleton variant="text" width={180} height={24} />
          <div className="grid grid-cols-1 border rounded-lg overflow-hidden">
            {[...Array(7)].map((_, index) => (
              <div key={index} className="grid grid-cols-2 md:grid-cols-4 border-b">
                <div className="p-4 bg-gray-100 font-medium">
                  <Skeleton variant="text" width={100} height={20} />
                </div>
                <div className="p-4">
                  <Skeleton variant="text" width={120} height={20} />
                </div>
                <div className="p-4 bg-gray-100 font-medium">
                  <Skeleton variant="text" width={100} height={20} />
                </div>
                <div className="p-4">
                  <Skeleton variant="text" width={120} height={20} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }