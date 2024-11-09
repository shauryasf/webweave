import React, {useState} from "react";
import { useNavigate } from "react-router-dom";

function Header(){
    // toggle to check if menu is open or not for responsiveness
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };
    return (
        <header className="flex justify-between items-center pt-8 pb-8 pl-16 pr-16 relative">
            <div className="text-2xl font-bold cursor-pointer" onClick={() => navigate("/")}>WebWeave</div>
            <nav className={`md:right-0 rounded p-2 ${menuOpen ? 'flex' : 'hidden'} md:block`}>
                <ul className="flex flex-col md:flex-row gap-4 md:gap-6">
                    <li><a className="text-gray-300 hover:text-white cursor-pointer" onClick={() => navigate("/")}>Home</a></li>
                    <li><a className="text-gray-300 hover:text-white cursor-pointer" onClick={() => navigate("/#home-features")}>Features</a></li>
                    <li><a className="text-gray-300 hover:text-white cursor-pointer" onClick={() => navigate("/auth")}>Login</a></li>
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
