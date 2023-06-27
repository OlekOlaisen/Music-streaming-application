import React from "react";
import { Link } from "react-router-dom";
import { HouseDoorFill, Search, MusicNoteList } from 'react-bootstrap-icons';



function Footer() {
  return (
	<section classname='footer'>
		<Link className="footer__link" to="/"><HouseDoorFill /></Link>
		<Link className="footer__link" to="/search"><Search /></Link>
		<Link className="footer__link" to="/playlists"><MusicNoteList /></Link>
	</section>
  );
}

export default Footer;
