import React, {useState} from "react";
function Header(){
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };
    return (
        <header className="flex justify-between items-center pt-8 pb-8 pl-16 pr-16 relative">
            <div className="text-2xl font-bold cursor-pointer">WebWeave</div>
            <nav className={`md:right-0 rounded p-2 ${menuOpen ? 'flex' : 'hidden'} md:block`}>
                <ul className="flex flex-col md:flex-row gap-4 md:gap-6">
                    <li><a href="#" className="text-gray-300 hover:text-white">Product</a></li>
                    <li><a href="#" className="text-gray-300 hover:text-white">Features</a></li>
                    <li><a href="#" className="text-gray-300 hover:text-white">Templates</a></li>
                    <li><a href="#" className="text-gray-300 hover:text-white">Pricing</a></li>
                    <li><a href="#" className="text-gray-300 hover:text-white">FAQ</a></li>
                </ul>
            </nav>
            <button className="flex flex-col md:hidden" onClick={toggleMenu}>
                <span className="w-6 h-1 bg-white mb-1"></span>
                <span className="w-6 h-1 bg-white mb-1"></span>
                <span className="w-6 h-1 bg-white"></span>
            </button>
        </header>
    )
}
export default Header;