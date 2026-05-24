import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#F8FAFC] border-t border-gray-200 mt-24">

      {/* ================= CTA ================= */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div
          className="
          bg-blue-700
          rounded-[36px]
          px-8
          md:px-14
          py-14
          flex
          flex-wrap
          justify-between
          items-center
          gap-10
          shadow-xl
        "
        >
          {/* LEFT */}
          <div className="max-w-2xl">
            <span
              className="
              inline-block
              bg-white/20
              text-white
              px-5
              py-2
              rounded-full
              text-sm
              font-semibold
            "
            >
              Find Your Next Rental
            </span>

            <h2
              className="
              text-3xl
              md:text-5xl
              font-bold
              text-white
              mt-5
              leading-tight
            "
            >
              Ready to Find Your
              Perfect Room?
            </h2>

            <p className="text-blue-100 mt-5 text-lg">
              Discover trusted rooms,
              verified owners and
              secure communication
              with Rentify.
            </p>
          </div>

          {/* BUTTON */}
          <Link
            to="/search"
            className="
            bg-white
            text-blue-700
            px-8
            py-4
            rounded-[20px]
            font-bold
            text-lg
            hover:bg-gray-200
            transition
            shadow-lg
          "
          >
            Explore Rooms
          </Link>
        </div>
      </section>

      {/* ================= MAIN FOOTER ================= */}
      <section className="max-w-7xl mx-auto px-6 py-16">

        <div className="flex flex-wrap justify-between gap-14">

          {/* BRAND */}
          <div className="flex-1 min-w-[250px]">

            <h2 className="text-3xl font-extrabold text-gray-900">
              Rentify
            </h2>

            <p className="text-gray-600 mt-5 leading-8">
              Rentify is a modern
              rental platform helping
              renters find trusted,
              affordable and verified
              rental spaces with
              secure communication.
            </p>

            {/* SOCIALS */}
            <div className="flex gap-4 mt-8">

              {[
                "📘",
                "📸",
                "🐦",
                "💼",
              ].map(
                (
                  icon,
                  index
                ) => (
                  <div
                    key={index}
                    className="
                    w-14
                    h-14
                    rounded-full
                    bg-white
                    border
                    shadow-sm
                    flex
                    items-center
                    justify-center
                    text-2xl
                    cursor-pointer
                    hover:shadow-xl
                    hover:-translate-y-1
                    transition-all
                  "
                  >
                    {icon}
                  </div>
                )
              )}
            </div>
          </div>

          {/* COMPANY */}
          <div className="min-w-[180px]">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Company
            </h3>

            <div className="flex flex-col gap-4 text-gray-600">

              <Link
                to="/about"
                className="hover:text-blue-700 transition"
              >
                About Us
              </Link>

              <Link
                to="/contact"
                className="hover:text-blue-700 transition"
              >
                Contact
              </Link>

              <Link
                to="/careers"
                className="hover:text-blue-700 transition"
              >
                Careers
              </Link>
            </div>
          </div>

          {/* SUPPORT */}
          <div className="min-w-[200px]">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Support
            </h3>

            <div className="flex flex-col gap-4 text-gray-600">

              <Link
                to="/help"
                className="hover:text-blue-700 transition"
              >
                Help Center
              </Link>

              <Link
                to="/faq"
                className="hover:text-blue-700 transition"
              >
                FAQ
              </Link>

              <Link
                to="/terms"
                className="hover:text-blue-700 transition"
              >
                Terms & Conditions
              </Link>

              <Link
                to="/privacy"
                className="hover:text-blue-700 transition"
              >
                Privacy Policy
              </Link>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div className="min-w-[200px]">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Quick Links
            </h3>

            <div className="flex flex-col gap-4 text-gray-600">

              <Link
                to="/search"
                className="hover:text-blue-700 transition"
              >
                Browse Rooms
              </Link>

              <Link
                to="/signin"
                className="hover:text-blue-700 transition"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="hover:text-blue-700 transition"
              >
                Register
              </Link>

              <Link
                to="/post"
                className="hover:text-blue-700 transition"
              >
                Post Listing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= COPYRIGHT ================= */}
      <div className="border-t border-gray-200">

        <div
          className="
          max-w-7xl
          mx-auto
          px-6
          py-8
          flex
          flex-wrap
          justify-between
          items-center
          gap-4
        "
        >
          <p className="text-gray-500 text-sm">
            ©{" "}
            {new Date().getFullYear()}
            {" "}
            Rentify.
            All rights reserved.
          </p>

          <div className="flex gap-6 text-sm text-gray-500">
            <Link
              to="/privacy"
              className="hover:text-blue-700"
            >
              Privacy
            </Link>

            <Link
              to="/terms"
              className="hover:text-blue-700"
            >
              Terms
            </Link>

            <Link
              to="/contact"
              className="hover:text-blue-700"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}