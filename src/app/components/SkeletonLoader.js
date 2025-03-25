import { Skeleton, Box, Grid, Button } from "@mui/material";
 import OverviewSkeleton from "./OverViewSkeleton";
 const SkeletonLoader = () => {
     return (
         <div className="w-full px-4 md:px-8 lg:px-36 flex flex-col gap-8 md:py-8">
             <div className="flex flex-col md:flex-row gap-8 lg:py-10">
                 <div className="space-y-4 md:min-w-3/5">
                     <Box className="relative md:h-[75vh] aspect-[4/3] w-full overflow-hidden rounded-lg bg-gray-100">
                         <Skeleton variant="rectangular" width="100%" height="100%" />
                     </Box>
 
                     {/* Thumbnails */}
                     <Grid container spacing={1} className="hidden md:flex pb-2">
                         {[...Array(4)].map((_, index) => (
                             <Grid item key={index}>
                                 <Skeleton variant="rectangular" width={112} height={112} className="rounded-lg" />
                             </Grid>
                         ))}
                     </Grid>
                 </div>
                 <div className="space-y-3 md:w-2/5">
                     <Skeleton variant="text" width="80%" height={40} />
 
                     <Box className="flex justify-between items-center">
                         <Skeleton variant="text" width="40%" height={30} />
                         <Skeleton variant="circular" width={32} height={32} />
                     </Box>
 
                     <Skeleton variant="text" width="100%" height={30} />
                     <Skeleton variant="text" width="60%" height={30} />
 
                     <Box className="grid grid-cols-2 gap-4">
                         <Skeleton variant="rectangular" width="100%" height={50} />
                         <Skeleton variant="rectangular" width="100%" height={50} />
                     </Box>
 
                     <Box className="mt-4 pt-4 border-t flex gap-4 items-center">
                         <Skeleton variant="circular" width={48} height={48} />
                         <Box>
                             <Skeleton variant="text" width={100} height={20} />
                             <Skeleton variant="text" width={150} height={15} />
                         </Box>
                     </Box>
                 </div>
             </div>
             <div className="md:w-3/5">
                 <div>
                     <OverviewSkeleton />
                 </div>
             </div>
         </div>
     );
 };
 
 export default SkeletonLoader;