import React, { useContext, useEffect, useReducer, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Store } from '../Store';
import { getError } from '../utils';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };
    case 'ORDER_READY_REQUEST':
      return { ...state, loadingOrderReady: true };
    case 'ORDER_READY_SUCCESS':
      return { ...state, loadingOrderReady: false, successOrderReady: true };
    case 'ORDER_READY_FAIL':
      return { ...state, loadingOrderReady: false };

    default:
      return state;
  }
};
export default function ProductEditScreen() {
  const navigate = useNavigate();
  const params = useParams(); // /order/:id
  const { id: orderID } = params;

  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  async function estimatedDeliveryHandler() {
    try {
      dispatch({ type: 'ORDER_READY_REQUEST' });
      const { data } = await axios.put(
        `https://samarithanna-api.onrender.com/api/orders/${orderID}/estimatedDelivery`,
        { estimatedDelivery: date },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: 'ORDER_READY_SUCCESS', payload: data });
      toast.success('Order estimated delivery is ready');
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'ORDER_READY_FAIL' });
    }
  }

  const [date, setDate] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(
          `https://samarithanna-api.onrender.com/api/orders/${orderID}`,
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        setDate(data.estimatedDelivery || '');
        dispatch({ type: 'FETCH_SUCCESS' });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [orderID, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      await axios.put(
        `https://samarithanna-api.onrender.com/api/orders/${orderID}`,
        {
          _id: orderID,
          estimatedDelivery: date,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: 'UPDATE_SUCCESS',
      });
      toast.success('Order updated successfully');
      navigate('/admin/orders');
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'UPDATE_FAIL' });
    }
  };

  return (
    <Container className="small-container">
      <Helmet>
        <title>Edit Order{orderID}</title>
      </Helmet>
      <h1>Asignar Fecha de Entrega</h1>

      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>No. de Orden</Form.Label>{' '}
            <Form.Label>{orderID}</Form.Label>
          </Form.Group>

          <Form.Group className="mb-3" controlId="description">
            <Form.Label>Fecha de entrega</Form.Label>
            <Form.Control
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </Form.Group>
          <div className="mb-3">
            <Button
              disabled={loadingUpdate}
              type="submit"
              onClick={estimatedDeliveryHandler}
            >
              Update
            </Button>
            {loadingUpdate && <LoadingBox></LoadingBox>}
          </div>
        </Form>
      )}
    </Container>
  );
}
