import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Footer from './components/footer.jsx';
import Home from './pages/home.jsx';
import NotFound from './pages/notFound.jsx';
import Search from './pages/search.jsx';
import Playlists from './pages/playlists.jsx';

function AppRoutes() {
  return (
    <Router>     
        <Routes>
          <Route path="/" element={<Home />} />
			 <Route path="/search" element={<Search />} />
			 <Route path="/playlists" element={<Playlists />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer/>
    </Router>
    

  );
}

export default AppRoutes;
