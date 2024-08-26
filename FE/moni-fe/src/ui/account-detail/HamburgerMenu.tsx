import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function HamburgerMenu() {
    const navigate = useNavigate();
    const menuRef = useRef<HTMLDivElement | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleClickOutside = (event: any) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    }

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        // to avoid bubbling effect
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <nav ref={menuRef}>
            {/* Hamburger Button */}
            <button
                onClick={toggleMenu}
                className="block md:hidden p-2 focus:outline-none absolute z-50"
            >
                <div className="w-6 h-6 relative bg-violet-200 rounded-full p-5 shadow-lg">
                    {/* Top Line */}
                    <span
                        className={`bg-purple-600 block absolute left-2 h-0.5 w-6 bg-current transform transition duration-300 ease-in-out ${isOpen ? "rotate-45 top-4.5" : "top-[12px]"
                            }`}
                    ></span>
                    {/* Middle Line */}
                    <span
                        className={`block absolute left-2 h-0.5 w-6 bg-current transform transition duration-300 ease-in-out ${isOpen ? "opacity-0" : "top-[20px]"
                            }`}
                    ></span>
                    {/* Bottom Line */}
                    <span
                        className={`block absolute left-2 h-0.5 w-6 bg-current transform transition duration-300 ease-in-out ${isOpen ? "-rotate-45 top-4.5" : "top-[28px]"
                            }`}
                    ></span>
                </div>
            </button>
            <aside className={`${isOpen ? "block" : "hidden"} row-span-3`}>
                <div className="absolute top-[4rem] z-30">
                    {/* Menu Items */}
                    <nav className={`${isOpen ? "block" : "hidden"} md:flex flex-col md:flex-row  md:relative top-12 md:top-0 left-0 w-full z-50 md:w-auto`} >
                        <div className="bg-gray-400 absolute z-50" >
                            <span className='block px-4 py-2 text-gray-700 hover:bg-gray-200' onClick={() => navigate('1/main')}>Transactions</span>
                            <span className='block px-4 py-2 text-gray-700 hover:bg-gray-200' onClick={() => navigate('1/timespans')}>Timespans</span>
                            <span className='block px-4 py-2 text-gray-700 hover:bg-gray-200' onClick={() => navigate('1/charts')}>Charts</span>
                        </div>
                    </nav>
                </div>
            </aside>
        </nav>

    );
}

export default HamburgerMenu;
