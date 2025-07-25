import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-700 py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* ───────── Column 1 – About ───────── */}
        <div>
          <h4 className="font-bold mb-2 text-green-700">Guyana Home Hub</h4>
          <p>
            Your trusted platform for buying, selling, and renting property in
            Guyana.
          </p>
        </div>

        {/* ───────── Column 2 – Explore ───────── */}
        <div>
          <h4 className="font-bold mb-2 text-green-700">Explore</h4>
          <ul className="space-y-1">
            <li>
              <Link href="/properties/buy" className="hover:text-green-700">
                Buy
              </Link>
            </li>
            <li>
              <Link href="/properties/rent" className="hover:text-green-700">
                Rent
              </Link>
            </li>
            <li>
              <Link
                href="/properties/developments"
                className="hover:text-green-700"
              >
                Developments
              </Link>
            </li>
            <li>
              <Link href="/advertise" className="hover:text-green-700">
                Advertise
              </Link>
            </li>
          </ul>
        </div>

        {/* ───────── Column 3 – Help / Auth ───────── */}
        <div>
          <h4 className="font-bold mb-2 text-green-700">Help</h4>
          <ul className="space-y-1">
            <li>
              <Link href="/contact" className="hover:text-green-700">
                Contact&nbsp;Us
              </Link>
            </li>
            <li>
              <Link href="/register" className="hover:text-green-700">
                Register
              </Link>
            </li>
            <li className="mt-2 pt-2 border-t border-gray-300">
              <div className="text-xs font-semibold text-green-700 mb-1">
                For Agents
              </div>
              <Link
                href="/agent-register"
                className="text-sm hover:text-green-700 block"
              >
                Agent Registration
              </Link>
              <Link
                href="/agent-login"
                className="text-sm text-gray-500 hover:text-green-700 block mt-1"
              >
                Agent Login
              </Link>
            </li>
            <li className="mt-4">
              <Link href="/privacy" className="hover:text-green-700">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-green-700">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="text-center text-sm text-gray-500 mt-8">
        © {new Date().getFullYear()} Guyana Home Hub. All rights reserved.
        <br />
        A subsidiary of <strong>Caribbean Home Hub LLC</strong>, a registered company in Missouri, USA.{" "}
        <Link 
          href="/admin-login" 
          className="text-gray-400 hover:text-gray-500 text-xs"
          title="Corporate Access"
        >
          [CHH-SYS]
        </Link>
      </div>
    </footer>
  );
}
