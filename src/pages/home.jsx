import logo from '../assets/images/logo.png'

function Home() {
  return (
	<main className="home">
    <img className='home__logo' src={logo} alt="logo" />
    <div className="home__trending-tracks"></div>
    <div className="home__trending-artists"></div>
  </main>
  );
}

export default Home;
