import React from 'react';
import { UserIcon } from '@heroicons/react/24/solid';

interface OwnerContactProps {
  name: string;
  phone?: string | null;
}

export const OwnerContact: React.FC<OwnerContactProps> = ({ name, phone }) => (
  <div className="flex items-center gap-3 py-4 border-t border-gray-100 mt-6">
    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
      <UserIcon className="w-5 h-5 text-gray-400" />
    </div>
    <div>
      <p className="text-sm text-gray-500">Listed by</p>
      <p className="text-sm font-medium text-gray-700">{name}</p>
      {phone && (
        <a
          href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}`}
          className="text-sm text-gray-500 hover:text-gray-700 underline"
        >
          {phone}
        </a>
      )}
    </div>
  </div>
);
