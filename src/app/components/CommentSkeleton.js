export default function CommentSkeleton() {
    return (
        <div className="flex items-start mb-4 animate-pulse">
            <div className="w-10 h-10 rounded-full bg-gray-300 mr-3"></div>
            <div className="flex-1">
                <div className="h-4 w-32 bg-gray-300 rounded mb-1"></div>
                <div className="h-3 w-24 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 w-full bg-gray-300 rounded mb-2"></div>
                <div className="h-4 w-5/6 bg-gray-300 rounded"></div>
                <div className="flex items-center mt-2 space-x-4">
                    <div className="h-6 w-12 bg-gray-300 rounded"></div>
                </div>
            </div>
        </div>
    );
}
