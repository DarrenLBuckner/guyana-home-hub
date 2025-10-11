import React from 'react';

export default function ComingSoonLender() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
      <h1 className="text-4xl font-bold text-green-700 mb-4">Coming Soon: Lender & Loan Officer Portal</h1>
      <p className="text-lg text-gray-700 mb-6 max-w-xl text-center">
        Thanks for your interest in offering financial services through Guyana Home Hub. Our mortgage and loan tools are coming soon!
      </p>
      <p className="mb-4 text-gray-600">Want to partner or get notified? Contact us:</p>
      <div className="flex flex-col items-center gap-2">
        <a href="mailto:info@guyanahomehub.com" className="text-green-700 underline font-medium">info@guyanahomehub.com</a>
        <a
          href="https://wa.me/5927629797?text=Hi%20Guyana%20Home%20Hub%2C%20I'm%20interested%20in%20Lender%20and%20Loan%20Officer%20services."
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-700 underline font-medium bg-green-50 px-3 py-1 rounded flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 14.487c-.263-.131-1.558-.77-1.799-.858-.241-.088-.417-.131-.593.132-.175.263-.676.858-.828 1.033-.151.175-.304.197-.567.066-.263-.132-1.111-.409-2.117-1.304-.782-.696-1.31-1.556-1.464-1.819-.151-.263-.016-.405.115-.536.118-.117.263-.304.395-.456.132-.151.175-.263.263-.438.088-.175.044-.329-.022-.462-.066-.132-.593-1.433-.813-1.963-.214-.514-.433-.444-.593-.452l-.504-.009c-.175 0-.462.066-.705.329-.241.263-.926.905-.926 2.205 0 1.3.948 2.557 1.08 2.732.132.175 1.87 2.857 4.522 3.89.633.217 1.127.346 1.513.443.636.162 1.215.139 1.673.084.511-.06 1.558-.637 1.779-1.253.22-.616.22-1.143.154-1.253-.066-.11-.241-.175-.504-.307z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12c0-4.97-4.03-9-9-9s-9 4.03-9 9c0 1.61.43 3.13 1.18 4.44L3 21l4.7-1.23A8.963 8.963 0 0012 21c4.97 0 9-4.03 9-9z" />
          </svg>
          WhatsApp us
        </a>
      </div>
      <div className="mt-8 text-center text-gray-500">
        "Financing Guyana’s real estate dreams."
      </div>
    </div>
  );
}
