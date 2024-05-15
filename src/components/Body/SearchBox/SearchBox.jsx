import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Imported Icons ===========>
import { BiSearchAlt } from 'react-icons/bi';

export default function SearchBox() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const submitHandler = (e) => {
    e.preventDefault();
    navigate(query ? `/search/?query=${query}` : '/search');
  };

  return (
    <form className="d-flex me-auto" onSubmit={submitHandler}>
      <input
        type="text"
        placeholder="Search products"
        id="searchBox"
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit" id="button-search">
        <BiSearchAlt className="icon" />
      </button>
    </form>
  );
}
