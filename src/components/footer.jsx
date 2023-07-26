import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { HouseDoorFill, HouseDoor } from 'react-bootstrap-icons';
import { RiSearchLine, RiSearchFill, RiPlayListLine, RiPlayListFill,RiSearchEyeLine } from "react-icons/ri";

function Footer() {


	const location = useLocation();

    const isActive = path => location.pathname === path;

  return (
	<div className="footer__container">
	<section className='footer'>
            <NavLink className="footer__link" to="/" end>
                {isActive('/') ? <HouseDoorFill /> : <HouseDoor />}
            </NavLink>
            <NavLink className="footer__link" to="/search">
                {isActive('/search') ? <RiSearchEyeLine /> : <RiSearchLine />}
            </NavLink>
            <NavLink className="footer__link" to="/playlists">
                {isActive('/playlists') ? <RiPlayListFill /> : <RiPlayListLine />}
            </NavLink>
        </section>

        <section className='footer__desktop'>
            <NavLink className="footer__desktop-link" to="/" end>
                {isActive('/') ? <HouseDoorFill className="footer__desktop-link-icon"/> : <HouseDoor className="footer__desktop-link-icon"/>} Home
            </NavLink>
            <NavLink className="footer__desktop-link" to="/search">
                {isActive('/search') ? <RiSearchFill className="footer__desktop-link-icon"/> : <RiSearchLine className="footer__desktop-link-icon"/>} Search
            </NavLink>
            <NavLink className="footer__desktop-link" to="/playlists">
                {isActive('/playlists') ? <RiPlayListFill className="footer__desktop-link-icon"/> : <RiPlayListLine className="footer__desktop-link-icon"/>} Playlists
            </NavLink>
        </section>
	</div>
  );
}

export default Footer;
