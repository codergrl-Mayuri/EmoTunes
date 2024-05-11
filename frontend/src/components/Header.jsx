import React, { useState } from 'react';
import { useNavigate,Link } from "react-router-dom";
import logo from '../assets/logo_black.png';

function Header() {
    const navigate = useNavigate()
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <nav className="bg-black flex flex-wrap backdrop-blur-sm bg-opacity-70 items-center justify-between p-3 fixed top-0 z-40 w-screen px-10">
            <Link to="/" className='w-16 h-auto'>
                <img src={logo} className="w-full" alt="ACME Logo" style={{borderRadius:"50%"}}/>
            </Link>
            <div className="flex md:hidden">
                <button id="hamburger" onClick={toggleMenu}>
                    <img className={menuOpen ? "block" : "hidden"} src="https://img.icons8.com/fluent-systems-regular/2x/close-window.png" width="40" height="40" />
                    <img className={!menuOpen ? "block" : "hidden"} src="https://img.icons8.com/fluent-systems-regular/2x/menu-squared-2.png" width="40" height="40" />
                </button>
            </div>
            <Link to={"/login"} className="toggle hidden md:flex w-full md:w-auto y-2.5 px-6 py-2 rounded-lg text-sm font-medium text-white bg-[#DAA520]">login</Link>
        </nav>
    );
}

export default Header;
