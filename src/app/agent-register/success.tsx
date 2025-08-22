import React from 'react';
import { useRouter } from 'next/navigation';

export default function AgentRegistrationSuccess() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-4 text-green-700">Registration Successful!</h1>
        <p className="mb-4 text-gray-700">
          Check your email to confirm your account.<br />
          After confirmation, you can access your agent portal.
        </p>
        <div className="mb-4 text-sm text-gray-600">
          <strong>Note:</strong> If you don't see the confirmation email, please check your spam or junk folder and mark it as 'Not Spam'.
        </div>
        <button
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 font-semibold"
          onClick={() => router.push('/portal-ghh-login')}
        >
          Access Agent Portal
        </button>
      </div>
    </div>
  );
}
