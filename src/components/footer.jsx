import React from "react";
import { Link } from "react-router-dom";
import { HouseDoorFill, Search, MusicNoteList } from 'react-bootstrap-icons';



function Footer() {
  return (
	<div className="footer__container">
	<section className='footer'>
		<Link className="footer__link" to="/"><HouseDoorFill /></Link>
		<Link className="footer__link" to="/search"><Search /></Link>
		<Link className="footer__link" to="/playlists"><MusicNoteList /></Link>
	</section>

	<section className='footer__desktop'>
		<Link className="footer__desktop-link" to="/"><HouseDoorFill className="footer__desktop-link-icon"/>Home</Link>
		<Link className="footer__desktop-link" to="/search"><Search className="footer__desktop-link-icon"/>Search</Link>
		<Link className="footer__desktop-link" to="/playlists"><MusicNoteList className="footer__desktop-link-icon"/>Playlists</Link>
	</section>
	</div>
  );
}

export default Footer;
