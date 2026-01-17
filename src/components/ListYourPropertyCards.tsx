// src/components/ListYourPropertyCards.tsx
import Image from "next/image";
import Link from "next/link";

export default function ListYourPropertyCards() {
  const cards = [
    {
      title: "List My Home – Flat fee, no agent fees",
      image: "/images/list-my-home.jpg",
      link: "/advertise#property-owners",
      external: false,
    },
    {
      title: "Agents Only – Agent Registration",
      image: "/images/agent-list-property.jpg",
      link: "/advertise#agents",
      external: false,
    },
    {
      title: "List My Rental – Flat rate listing",
      image: "/images/list-my-rental.jpg",
      link: "/advertise#property-owners",
      external: false,
    },
    {
      title: "Submit My Development – Email us your project",
      image: "/images/submit-development.jpg",
      link: "mailto:info@guyanahomehub.com?subject=Development%20Submission&body=Please%20include%20project%20details%20and%20images.",
      external: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 max-w-6xl mx-auto px-4 py-12">
      {cards.map((card, index) => {
        const CardContent = (
          <div className="rounded-lg overflow-hidden shadow-lg cursor-pointer hover:scale-105 transition-transform">
            <Image
              src={card.image}
              alt={card.title}
              width={600}
              height={400}
              className="w-full h-48 object-cover"
            />
            <div className="bg-green-600 text-white text-center py-4 text-base font-semibold">
              {card.title}
            </div>
          </div>
        );

        return card.external ? (
          <a
            key={index}
            href={card.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            {CardContent}
          </a>
        ) : (
          <Link key={index} href={card.link}>
            {CardContent}
          </Link>
        );
      })}
    </div>
  );
}
