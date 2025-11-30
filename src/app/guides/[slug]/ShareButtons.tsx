'use client';

interface GuideData {
  slug: string;
  title: string;
  description: string;
  content: string;
  readTime: string;
  category: string;
  lastUpdated: string;
}

interface ShareButtonsProps {
  guide: GuideData;
}

export function ShareButtons({ guide }: ShareButtonsProps) {
  const getCurrentUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.href;
    }
    return `https://guyanahomehub.com/guides/${guide.slug}`;
  };
  
  const handleFacebookShare = () => {
    const currentUrl = getCurrentUrl();
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
  };
  
  const handleWhatsAppShare = () => {
    const currentUrl = getCurrentUrl();
    const message = `Check out this helpful guide: "${guide.title}" - ${currentUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };
  
  return (
    <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg">
      <h3 className="font-semibold text-gray-800 mb-3">Share This Guide</h3>
      <div className="flex gap-2">
        <button 
          onClick={handleFacebookShare}
          className="flex-1 bg-blue-600 text-white text-center py-2 px-3 rounded text-sm hover:bg-blue-700 transition-colors"
        >
          Facebook
        </button>
        <button 
          onClick={handleWhatsAppShare}
          className="flex-1 bg-green-600 text-white text-center py-2 px-3 rounded text-sm hover:bg-green-700 transition-colors"
        >
          WhatsApp
        </button>
      </div>
    </div>
  );
}