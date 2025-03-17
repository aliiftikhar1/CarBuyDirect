"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState("loading"); 

  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams.get("token");

      if (!token) {
        setStatus("error");
        return;
      }

      try {
        const response = await fetch("/api/user/verifyUser", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        if (response.ok) {
          setStatus("success");
          setTimeout(() => router.push("/"), 3000); // Redirect after success
        } else {
          setStatus("error");
        }
      } catch (error) {
        console.error("Error verifying token:", error);
        setStatus("error");
      }
    };

    verifyToken();
  }, [searchParams, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96 text-center">
        {status === "loading" && (
          <>
            <h2 className="text-xl font-semibold text-gray-800">Verifying...</h2>
            <p className="text-gray-600">Please wait while we verify your email.</p>
          </>
        )}
        {status === "success" && (
          <>
            <h2 className="text-xl font-semibold text-green-600">Email Verified!</h2>
            <p className="text-gray-600">Redirecting to login...</p>
          </>
        )}
        {status === "error" && (
          <>
            <h2 className="text-xl font-semibold text-red-600">Verification Failed</h2>
            <p className="text-gray-600">Invalid or expired token.</p>
          </>
        )}
      </div>
    </div>
  );
}
