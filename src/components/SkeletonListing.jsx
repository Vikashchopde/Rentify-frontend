export default function SkeletonListing() {
    return (
      <div className="bg-white shadow-sm border rounded-xl p-4 animate-pulse w-full sm:w-[48%] lg:w-[30%]">
        <div className="h-40 bg-gray-300 rounded-xl"></div>
        <div className="h-4 bg-gray-300 rounded mt-4 w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded mt-2 w-1/2"></div>
        <div className="h-5 bg-gray-300 rounded mt-4 w-1/3"></div>
      </div>
    );
  }
  