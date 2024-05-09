import axios from 'axios';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import { getError } from '../utils';
import { toast } from 'react-toastify';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'PAY_REQUEST':
      return { ...state, loadingPay: true };
    case 'PAY_SUCCESS':
      return { ...state, loadingPay: false, successPay: true };
    case 'PAY_FAIL':
      return { ...state, loadingPay: false };
    case 'PAY_RESET':
      return { ...state, loadingPay: false, successPay: false };
    case 'DELIVER_REQUEST':
      return { ...state, loadingDeliver: true };
    case 'DELIVER_SUCCESS':
      return { ...state, loadingDeliver: false, successDeliver: true };
    case 'DELIVER_FAIL':
      return { ...state, loadingDeliver: false };
    case 'DELIVER_RESET':
      return {
        ...state,
        loadingDeliver: false,
        successDeliver: false,
        order: {
          ...state.order,
          isDelivered: true,
        },
      };
    // case 'DELIVERY_UPDATE':
    //   return {
    //     ...state,
    //     order: {
    //       ...state.order,
    //       isDelivered: true,
    //     },
    //   };
    case 'ORDER_READY_REQUEST':
      return { ...state, loadingOrderReady: true };
    case 'ORDER_READY_SUCCESS':
      return { ...state, loadingOrderReady: false, successOrderReady: true };
    case 'ORDER_READY_FAIL':
      return { ...state, loadingOrderReady: false };
    case 'ORDER_READY_RESET':
      return {
        ...state,
        loadingOrderReady: false,
        successOrderReady: false,
        order: {
          ...state.order,
          isReady: true,
        },
      };

    default:
      return state;
  }
}

export default function OrderScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const params = useParams();
  const { id: orderId } = params;
  const navigate = useNavigate();
  const [
    {
      loading,
      error,
      order,
      successPay,
      loadingPay,
      successDeliver,
      loadingDeliver,
      successOrderReady,
      loadingOrderReady,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    order: {},
    error: '',
    successPay: false,
    loadingPay: false,
  });

  const [emailSentForDeliver, setEmailSentForDeliver] = useState(false);
  const [emailSentForOrderReady, setEmailSentForOrderReady] = useState(false);
  const [emailSentForApproval, setEmailSentForApproval] = useState(false);

  async function onApprove() {
    if (emailSentForApproval) return;
    try {
      dispatch({ type: 'PAY_REQUEST' });
      const { data } = await axios.put(
        `https://samarithanna-api.onrender.com/api/orders/${order._id}/order-processed`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: 'PAY_SUCCESS', payload: data });
      toast.success('Your order has been received');
      setEmailSentForApproval(true);
    } catch (err) {
      dispatch({ type: 'PAY_FAIL', payload: getError(err) });
      // toast.error(getError(err));
      console.log(
        'Cast to ObjectId failed for value "undefined" (type string) at path "_id" for model "Order"'
      );
    }
  }

  useEffect(() => {
    if (order && !loadingPay && !successPay && !order.orderEmailSent) {
      onApprove();
    }
  }, [order, loadingPay, successPay]);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(
          `https://samarithanna-api.onrender.com/api/orders/${orderId}`,
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    if (!userInfo) {
      return navigate('/login');
    }
    if (!order._id || (order._id && order._id !== orderId)) {
      fetchOrder();
    }
    if (successDeliver) {
      dispatch({ type: 'DELIVER_RESET' });
    }
    if (successOrderReady) {
      dispatch({ type: 'ORDER_READY_RESET' });
    }
  }, [order, userInfo, orderId, successDeliver, successOrderReady, navigate]);

  async function deliverOrderHandler() {
    if (emailSentForDeliver) return; // Prevent multiple emails
    try {
      dispatch({ type: 'DELIVER_REQUEST' });
      const { data } = await axios.put(
        `https://samarithanna-api.onrender.com/api/orders/${order._id}/deliver`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: 'DELIVER_SUCCESS', payload: data });
      toast.success('Order is delivered');
      setEmailSentForDeliver(true); // Set flag after email is sent
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'DELIVER_FAIL' });
    }
  }

  async function orderReadyHandler() {
    if (emailSentForOrderReady) return;
    try {
      dispatch({ type: 'ORDER_READY_REQUEST' });
      const { data } = await axios.put(
        `https://samarithanna-api.onrender.com/api/orders/${order._id}/ready`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: 'ORDER_READY_SUCCESS', payload: data });
      toast.success('Order is ready');

      setEmailSentForOrderReady(true);
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'ORDER_READY_FAIL' });
    }
  }

  return loading ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <Helmet>
        <title>Pedido {orderId}</title>
      </Helmet>
      <h1 className="my-3">Pedido {orderId}</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Envío</Card.Title>
              <Card.Text>
                <strong>Nombre o Razón Social:</strong>{' '}
                {order.shippingAddress.fullName} <br />
                <strong>Dirección: </strong> {order.shippingAddress.address},
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                ,{order.shippingAddress.country}
              </Card.Text>
              {order.isDelivered ? (
                <MessageBox variant="success">Entregado</MessageBox>
              ) : (
                <MessageBox variant="danger">No entregado</MessageBox>
              )}
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Pago</Card.Title>
              <Card.Text>
                <strong>Método de pago:</strong> {order.paymentMethod}
              </Card.Text>
              {order.isPaid ? (
                <MessageBox variant="success">
                  {/* Paid at {order.paidAt} */}
                  Pagado
                </MessageBox>
              ) : (
                <MessageBox variant="danger">No Pagado</MessageBox>
              )}
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Productos</Card.Title>
              <ListGroup variant="flush">
                {order.orderItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className="align-items-center">
                      <Col md={6}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid rounded img-thumbnail"
                        ></img>{' '}
                        <Link
                          to={`/product/${item.slug}`}
                          style={{ color: '#005b27' }}
                        >
                          {item.name}
                        </Link>
                      </Col>
                      <Col md={3}>
                        <span>{item.quantity}</span>
                      </Col>
                      <Col md={3}>${item.price}</Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Devoluciones</Card.Title>
              <ListGroup variant="flush">
                {order.returnItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className="align-items-center">
                      <Col md={6}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid rounded img-thumbnail"
                        ></img>{' '}
                        <Link
                          to={`/product/${item.slug}`}
                          style={{ color: '#005b27' }}
                        >
                          {item.name}
                        </Link>
                      </Col>
                      <Col md={3}>
                        <span>{item.quantity}</span>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Resumen del Pedido</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Subtotal</Col>
                    <Col>${order.itemsPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Envío</Col>
                    <Col>${order.shippingPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>IVA</Col>
                    <Col>${order.taxPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong>Total</strong>
                    </Col>
                    <Col>
                      <strong>${order.totalPrice.toFixed(2)}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                {userInfo.isAdmin && !order.isReady && (
                  <ListGroup.Item>
                    {loadingOrderReady && <LoadingBox></LoadingBox>}
                    <div className="d-grid">
                      <Button type="button" onClick={orderReadyHandler}>
                        Order is Ready
                      </Button>
                    </div>
                  </ListGroup.Item>
                )}
                {userInfo.isAdmin && !order.isDelivered && (
                  // {userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                  <ListGroup.Item>
                    {loadingDeliver && <LoadingBox></LoadingBox>}
                    <div className="d-grid">
                      <Button type="button" onClick={deliverOrderHandler}>
                        Deliver Order
                      </Button>
                    </div>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
