import React from 'react';
import Skeleton from '@mui/material/Skeleton';

const AuctionSkeleton = () => {
  return (
    <div className="block w-full h-full relative border rounded-lg transition-transform duration-300">
      <div className="absolute top-2 left-2 right-auto md:left-auto md:right-2">
        <Skeleton variant="circular" width={24} height={24} />
      </div>

      <div className="flex w-full group flex-row md:flex-col h-36 md:h-full bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Image Skeleton */}
        <div className="relative w-2/5 md:w-full aspect-square sm:aspect-[16/10] md:aspect-[4/3] overflow-hidden">
          <Skeleton variant="rectangular" width="100%" height="100%" />
        </div>

        {/* Content Skeleton */}
        <div className="w-3/5 md:w-full flex flex-col justify-between flex-grow md:py-2 py-2 px-2">
          {/* Vehicle Title Skeleton */}
          <Skeleton variant="text" width="80%" height={24} />
          <Skeleton variant="text" width="60%" height={20} />

          {/* Status Skeleton */}
          <Skeleton variant="text" width="50%" height={20} />

          {/* Price & Location Skeleton */}
          <div className="flex justify-between items-center gap-1 w-full">
            <Skeleton variant="text" width="40%" height={20} />
            <Skeleton variant="text" width="40%" height={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

const AuctionSkeletonList = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(4)].map((_, index) => (
        <AuctionSkeleton key={index} />
      ))}
    </div>
  );
};

export default AuctionSkeletonList;
