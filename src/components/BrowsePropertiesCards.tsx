// src/components/BrowsePropertiesCards.tsx
import Image from "next/image";
import Link from "next/link";

export default function BrowsePropertiesCards() {
  const cards = [
    {
      title: "Buy a Home",
      image: "/images/buy-home.jpg",
      link: "/properties/buy",
    },
    {
      title: "Rent a Property",
      image: "/images/rent-property.jpg",
      link: "/properties/rent",
    },
    {
      title: "View Developments",
      image: "/images/view-developments.jpg",
      link: "/properties/developments",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4 py-12">
      {cards.map((card, index) => (
        <Link key={index} href={card.link}>
          <div className="rounded-lg overflow-hidden shadow-lg cursor-pointer hover:scale-105 transition-transform">
            <Image
              src={card.image}
              alt={card.title}
              width={600}
              height={400}
              className="w-full h-48 object-cover"
            />
            <div className="bg-green-600 text-white text-center py-4 text-lg font-semibold">
              {card.title}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
