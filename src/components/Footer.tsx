import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-700 py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h4 className="font-bold mb-2 text-green-700">Guyana Home Hub</h4>
          <p>Your trusted platform for buying, selling, and renting property in Guyana.</p>
        </div>

        <div>
          <h4 className="font-bold mb-2 text-green-700">Explore</h4>
          <ul className="space-y-1">
            <li><Link href="/properties/buy" className="hover:text-green-700">Buy</Link></li>
            <li><Link href="/properties/rent" className="hover:text-green-700">Rent</Link></li>
            <li><Link href="/properties/developments" className="hover:text-green-700">Developments</Link></li>
            <li><Link href="/advertise" className="hover:text-green-700">Advertise</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-2 text-green-700">Help</h4>
          <ul className="space-y-1">
            <li><Link href="/contact" className="hover:text-green-700">Contact Us</Link></li>
            <li><Link href="/signin" className="hover:text-green-700">Sign In</Link></li>
            <li><Link href="/register" className="hover:text-green-700">Register</Link></li>
          </ul>
        </div>
      </div>

      <div className="text-center text-sm text-gray-500 mt-8">
        © {new Date().getFullYear()} Guyana Home Hub. All rights reserved.
      </div>
    </footer>
  );
}
