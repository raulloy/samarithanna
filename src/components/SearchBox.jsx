import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import { useNavigate } from 'react-router-dom';

export default function SearchBox() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const submitHandler = (e) => {
    e.preventDefault();
    navigate(query ? `/search/?query=${query}` : '/search');
  };

  return (
    <Form
      className="d-flex me-auto"
      onSubmit={submitHandler}
      style={{ width: '100%' }}
    >
      <InputGroup>
        <FormControl
          type="text"
          name="q"
          id="q"
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Jocoque, Pan Árabe, Rosquillas..."
          aria-label="Search Products"
          aria-describedby="button-search"
        ></FormControl>
        <Button
          variant="outline-primary"
          type="submit"
          id="button-search"
          className="green-hover-button"
          style={{ color: '#008000', borderColor: '#008000' }}
        >
          <i className="fas fa-search"></i>
        </Button>
      </InputGroup>
    </Form>
  );
}
