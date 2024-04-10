import React, { useState, useContext } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Store } from '../Store';

function Product(props) {
  const { product } = props;
  const [quantity, setQuantity] = useState(1);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const addToCartHandler = async () => {
    const existItem = cartItems.find((x) => x._id === product._id);
    const quantityToAdd = existItem ? existItem.quantity + quantity : quantity;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantityToAdd) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, quantity: quantityToAdd },
    });
  };

  return (
    <Card className="product-card">
      <Link to={`/product/${product.slug}`}>
        <img src={product.image} className="card-img-top" alt={product.name} />
      </Link>
      <Card.Body className="product-card-body">
        <Link
          to={`/product/${product.slug}`}
          style={{ textDecoration: 'none', color: '#005b27' }}
        >
          <Card.Title style={{ color: '#005b27' }}>{product.name}</Card.Title>
        </Link>
        <Card.Text>${product.price}</Card.Text>
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <Button
              variant="light"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity === 1}
            >
              -
            </Button>{' '}
            <span>{quantity}</span>{' '}
            <Button
              variant="light"
              onClick={() => setQuantity(quantity + 1)}
              disabled={quantity === product.countInStock}
            >
              +
            </Button>
          </div>
          {product.countInStock === 0 ? (
            <Button variant="light" disabled>
              Out of stock
            </Button>
          ) : (
            <Button
              onClick={addToCartHandler}
              style={{
                backgroundColor: '#005b27',
                borderColor: '#005b27',
                marginTop: '10px',
              }}
            >
              Añadir al pedido
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}
export default Product;
