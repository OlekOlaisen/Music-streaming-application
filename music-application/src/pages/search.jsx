import { Search } from 'react-bootstrap-icons';

function SearchBar() {
  return (
	<section className="search">
    <label className="search__label" htmlFor="search"></label>
    <div className="search__input-container">
      <input className="search__input" type="text" name="search" id="search" placeholder="What do you want to listen to?" />
      <div className="search__input-icon"><Search /></div>
    </div>
  </section>
  );
}

export default SearchBar;
