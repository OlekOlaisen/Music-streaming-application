import React from "react";
import { NavLink } from "react-router-dom";
import { HouseDoorFill, HouseDoor } from 'react-bootstrap-icons';
import { RiSearchLine, RiSearchFill, RiPlayListLine, RiPlayListFill,RiSearchEyeLine } from "react-icons/ri";

function Footer() {
  return (
	<div className="footer__container">
	<section className='footer'>
		<NavLink className="footer__link" exact to="/" activeClassName="active">
			{({ isActive }) => isActive ? <HouseDoorFill /> : <HouseDoor />}
		</NavLink>
		<NavLink className="footer__link" to="/search" activeClassName="active">
			{({ isActive }) => isActive ? <RiSearchEyeLine /> : <RiSearchLine />}
		</NavLink>
		<NavLink className="footer__link" to="/playlists" activeClassName="active">
			{({ isActive }) => isActive ? <RiPlayListFill /> : <RiPlayListLine />}
		</NavLink>
	</section>

	<section className='footer__desktop'>
		<NavLink className="footer__desktop-link" exact to="/" activeClassName="active">
			{({ isActive }) => isActive ? <HouseDoorFill className="footer__desktop-link-icon"/> : <HouseDoor className="footer__desktop-link-icon"/>} Home
		</NavLink>
		<NavLink className="footer__desktop-link" to="/search" activeClassName="active">
			{({ isActive }) => isActive ? <RiSearchFill className="footer__desktop-link-icon"/> : <RiSearchLine className="footer__desktop-link-icon"/>} Search
		</NavLink>
		<NavLink className="footer__desktop-link" to="/playlists" activeClassName="active">
			{({ isActive }) => isActive ? <RiPlayListFill className="footer__desktop-link-icon"/> : <RiPlayListLine className="footer__desktop-link-icon"/>} Playlists
		</NavLink>
	</section>
	</div>
  );
}

export default Footer;
