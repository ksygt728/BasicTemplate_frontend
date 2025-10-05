"use client";

import { useState } from "react";
import Image from "next/image";
import MenuButton from "@/components/common/button/page";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const menuItems = [
    {
      name: "News",
      items: [
        "Breaking News",
        "Tech News",
        "Industry Updates",
        "Latest Trends",
      ],
    },
    {
      name: "Articles",
      items: ["Tutorials", "Best Practices", "Case Studies", "Reviews"],
    },
    {
      name: "Videos",
      items: ["Coding Tutorials", "Tech Talks", "Webinars", "Live Streams"],
    },
    {
      name: "Tricks",
      items: ["Code Snippets", "Quick Tips", "Shortcuts", "Hacks"],
    },
    {
      name: "PHP",
      items: ["PHP 8", "Frameworks", "Libraries", "Tools"],
    },
    {
      name: "Laravel",
      items: ["Laravel 11", "Packages", "Eloquent", "Blade"],
    },
    {
      name: "Vue",
      items: ["Vue 3", "Composition API", "Components", "Plugins"],
    },
    {
      name: "React",
      items: ["React 18", "Hooks", "Components", "State Management"],
    },
    {
      name: "Tailwindcss",
      items: ["Utilities", "Components", "Plugins", "Customization"],
    },
    {
      name: "Meraki UI",
      items: ["Components", "Templates", "Examples", "Documentation"],
    },
    {
      name: "CPP",
      items: ["C++20", "STL", "Algorithms", "Best Practices"],
    },
    {
      name: "JavaScript",
      items: ["ES2024", "Frameworks", "Libraries", "Tools"],
    },
    {
      name: "Ruby",
      items: ["Ruby 3", "Rails", "Gems", "Testing"],
    },
    {
      name: "Mysql",
      items: ["Queries", "Optimization", "Schema", "Administration"],
    },
    {
      name: "Pest",
      items: ["Testing", "Assertions", "Mocking", "Coverage"],
    },
    {
      name: "PHPUnit",
      items: ["Unit Tests", "Integration", "Mocking", "Coverage"],
    },
    {
      name: "Netlify",
      items: ["Deployment", "Functions", "Forms", "Analytics"],
    },
    {
      name: "VS Code",
      items: ["Extensions", "Settings", "Shortcuts", "Debugging"],
    },
    {
      name: "PHPStorm",
      items: ["Features", "Plugins", "Debugging", "Refactoring"],
    },
    {
      name: "Sublime",
      items: ["Packages", "Themes", "Shortcuts", "Customization"],
    },
  ];

  return (
    <>
      <nav className="relative bg-white shadow dark:bg-gray-800">
        <div className="container px-6 py-3 mx-auto">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <a href="#">
                  <Image
                    className="w-auto h-6 sm:h-7"
                    src="https://merakiui.com/images/full-logo.svg"
                    alt="Logo"
                    width={200}
                    height={32}
                  />
                </a>

                {/* Search input on desktop screen */}
                <div className="hidden mx-10 md:block">
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                      </svg>
                    </span>

                    <input
                      type="text"
                      className="w-full py-2 pl-10 pr-4 text-gray-700 bg-white border rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-opacity-40 focus:ring-blue-300"
                      placeholder="Search"
                    />
                  </div>
                </div>
              </div>

              {/* Mobile menu button */}
              <div className="flex lg:hidden">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  type="button"
                  className="text-gray-500 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 focus:outline-none focus:text-gray-600 dark:focus:text-gray-400"
                  aria-label="toggle menu"
                >
                  {!isOpen ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 8h16M4 16h16"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Mobile Menu */}
            <div
              className={`absolute inset-x-0 z-20 w-full px-6 py-2 transition-all duration-300 ease-in-out bg-white top-24 dark:bg-gray-800 md:mt-0 md:p-0 md:top-0 md:relative md:bg-transparent md:w-auto md:opacity-100 md:translate-x-0 md:flex md:items-center ${
                isOpen
                  ? "translate-x-0 opacity-100"
                  : "opacity-0 -translate-x-full"
              }`}
            >
              <div className="flex flex-col md:flex-row md:mx-1">
                <a
                  className="my-2 text-sm leading-5 text-gray-700 transition-colors duration-300 transform dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:underline md:mx-4 md:my-0"
                  href="#"
                >
                  Home
                </a>
                <a
                  className="my-2 text-sm leading-5 text-gray-700 transition-colors duration-300 transform dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:underline md:mx-4 md:my-0"
                  href="#"
                >
                  Blog
                </a>
                <a
                  className="my-2 text-sm leading-5 text-gray-700 transition-colors duration-300 transform dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:underline md:mx-4 md:my-0"
                  href="#"
                >
                  Components
                </a>
                <a
                  className="my-2 text-sm leading-5 text-gray-700 transition-colors duration-300 transform dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:underline md:mx-4 md:my-0"
                  href="#"
                >
                  Courses
                </a>
              </div>

              {/* Search input on mobile screen */}
              <div className="my-4 md:hidden">
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </svg>
                  </span>

                  <input
                    type="text"
                    className="w-full py-2 pl-10 pr-4 text-gray-700 bg-white border rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-opacity-40 focus:ring-blue-300"
                    placeholder="Search"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="py-3 mt-1 -mx-5 whitespace-nowrap relative overflow-visible">
            {menuItems.map((menuItem) => (
              <div
                key={menuItem.name}
                className="relative inline-block group"
                onMouseEnter={() => {
                  // console.log("Mouse enter:", menuItem.name);
                  setActiveDropdown(menuItem.name);
                }}
                onMouseLeave={() => {
                  // console.log("Mouse leave:", menuItem.name);
                  setActiveDropdown(null);
                }}
              >
                <a
                  className="mx-4 text-sm leading-5 text-gray-700 transition-colors duration-300 transform dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:underline md:my-0 cursor-pointer"
                  href="#"
                >
                  {menuItem.name}
                </a>

                {/* Dropdown Menu */}
                {activeDropdown === menuItem.name && (
                  <div
                    className="absolute top-full left-0  w-48 bg-white dark:bg-gray-800 rounded-md shadow-xl border border-gray-200 dark:border-gray-700"
                    style={{ zIndex: 9999, display: "block" }}
                  >
                    <div className="py-2">
                      {menuItem.items.map((subItem, subIndex) => (
                        <a
                          key={subIndex}
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                        >
                          {subItem}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}
