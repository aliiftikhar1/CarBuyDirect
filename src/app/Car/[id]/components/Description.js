import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export default function Description({data}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="flex flex-col w-full py-10">
      {/* Header Section */}
      <div className="h-20 bg-gray-200 flex justify-between items-center px-5 cursor-pointer" onClick={toggleExpand}>
        <h2 className="text-3xl font-bold">Description</h2>
        {isExpanded ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
      </div>

      {/* Description Section */}
      <div
        className={`overflow-hidden transition-all duration-300 relative ${
          isExpanded ? "h-full" : "max-h-32"
        }`}
      >
        <div className={`absolute ${!isExpanded?'flex':'hidden'} w-full h-32 bg-gradient-to-t from-white to-transparent bottom-0`}>

        </div>
        <div className="mt-5  w-full flex flex-col">
        {data?.CarSubmission?.description ? (
          <div
            dangerouslySetInnerHTML={{ __html: data.CarSubmission.description }}
          ></div>
        ) : (
          <p>No highlights available.</p>
        )}
      </div>
      </div>

      {/* Read More / Less Button */}
      <button
        className="w-[10rem] h-[3rem] mx-auto bg-yellow-700/30 text-black font-medium mt-4 self-start"
        onClick={toggleExpand}
      >
        {isExpanded ? "Read Less" : "Read More"}
      </button>
    </div>
  );
}
