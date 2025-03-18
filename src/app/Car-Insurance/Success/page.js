import AnimatedBeam from "@/components/ui/animated-beam";

export default function SuccessPage() {
    return (
      <AnimatedBeam>
      <div className="min-h-screen flex items-center justify-center ">
        <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Insurance Application Submitted</h1>
          <p className="text-gray-600 mb-6">
            Thank you for submitting your car insurance application. We'll process your information and get back to you
            shortly.
          </p>
          <a
            href="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-200"
          >
            Return Home
          </a>
        </div>
      </div>
      </AnimatedBeam>
    )
  }
  
  