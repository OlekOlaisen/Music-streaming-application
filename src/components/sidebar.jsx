import React from "react";
import { Link } from "react-router-dom";
import { HouseDoorFill, Search, MusicNoteList } from 'react-bootstrap-icons';



function Sidebar() {
  return (

	<section className='sidebar'>
		<Link className="sidebar-link" to="/"><HouseDoorFill className="sidebar-link-icon"/>Home</Link>
		<Link className="sidebar-link" to="/search"><Search className="sidebar-link-icon"/>Search</Link>
		<Link className="sidebar-link" to="/playlists"><MusicNoteList className="sidebar-link-icon"/>Playlists</Link>
	</section>	
  );
}

export default Sidebar;
