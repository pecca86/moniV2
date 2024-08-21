import React, { useState } from "react";

function HamburgerMenu() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="relative">
            {/* Hamburger Button */}
            <button
                onClick={toggleMenu}
                className="block md:hidden p-2 focus:outline-none"
            >
                <div className="w-6 h-6 relative">
                    {/* Top Line */}
                    <span
                        className={`block absolute left-0 h-0.5 w-6 bg-current transform transition duration-300 ease-in-out ${isOpen ? "rotate-45 top-2.5" : "top-1"
                            }`}
                    ></span>
                    {/* Middle Line */}
                    <span
                        className={`block absolute left-0 h-0.5 w-6 bg-current transform transition duration-300 ease-in-out ${isOpen ? "opacity-0" : "top-2.5"
                            }`}
                    ></span>
                    {/* Bottom Line */}
                    <span
                        className={`block absolute left-0 h-0.5 w-6 bg-current transform transition duration-300 ease-in-out ${isOpen ? "-rotate-45 top-2.5" : "top-4"
                            }`}
                    ></span>
                </div>
            </button>

            {/* Menu Items */}
            <nav
                className={`${isOpen ? "block" : "hidden"
                    } md:flex flex-col md:flex-row absolute md:relative top-12 md:top-0 left-0 w-full md:w-auto bg-white md:bg-transparent`}
            >
                <a
                    href="#"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-200"
                >
                    Home
                </a>
                <a
                    href="#"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-200"
                >
                    About
                </a>
                <a
                    href="#"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-200"
                >
                    Services
                </a>
                <a
                    href="#"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-200"
                >
                    Contact
                </a>
            </nav>
        </div>
    );
}

export default HamburgerMenu;
