import React from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { WhatsAppIcon } from './WhatsAppIcon'; // You may need to create or import this icon

interface Agent {
  id: string;
  first_name: string;
  last_name: string;
  company: string;
  phone: string;
  profile_image?: string;
  is_verified_agent?: boolean;
}

interface Props {
  agent: Agent;
  onRequestViewing: (agent: Agent) => void;
}

export const AgentPromotionBox: React.FC<Props> = ({ agent, onRequestViewing }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
    <p className="text-sm text-gray-600 mb-4">
      Need help viewing this property? Contact a verified agent.
    </p>
    <div className="flex items-center gap-4 mb-4">
      <img
        src={agent.profile_image || '/default-avatar.png'}
        alt={agent.first_name}
        className="w-16 h-16 rounded-full object-cover"
      />
      <div>
        <p className="font-semibold text-gray-900">
          {agent.first_name} {agent.last_name}
        </p>
        <p className="text-sm text-gray-600">{agent.company}</p>
        {agent.is_verified_agent && (
          <span className="text-xs text-green-600">✓ Verified Agent</span>
        )}
      </div>
    </div>
    <div className="space-y-3">
      <a
        href={`https://wa.me/${agent.phone.replace(/[^0-9]/g, '')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg"
      >
        <WhatsAppIcon className="w-5 h-5" />
        Contact via WhatsApp
      </a>
      <button
        onClick={() => onRequestViewing(agent)}
        className="flex items-center justify-center gap-2 w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg"
      >
        <CheckCircleIcon className="w-5 h-5" />
        Request Viewing
      </button>
    </div>
  </div>
);
