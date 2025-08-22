// src/components/ListYourPropertyCards.tsx
import Image from "next/image";
import Link from "next/link";

export default function ListYourPropertyCards() {
  const cards = [
    {
      title: "List My Home – Flat fee, no agent fees",
      image: "/images/list-my-home.jpg",
      link: "https://portal.guyanahomehub.com/list-home",
      external: true,
    },
    {
      title: "Agents Only – Agent Registration",
      image: "/images/agent-list-property.jpg",
      link: "https://portal.guyanahomehub.com/agent-register",
      external: true,
    },
    {
      title: "List My Rental – Flat rate listing",
      image: "/images/list-my-rental.jpg",
      link: "https://portal.guyanahomehub.com/list-rental",
      external: true,
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
      {cards.map((card, index) => (
        card.link.startsWith("mailto:") ? (
          <a
            key={index}
            href={card.link}
            target="_blank"
            rel="noopener noreferrer"
          >
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
          </a>
        ) : (
          <a
            key={index}
            href={card.link}
            target={card.external ? "_blank" : undefined}
            rel={card.external ? "noopener noreferrer" : undefined}
          >
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
          </a>
        )
      ))}
    </div>
  );
}
