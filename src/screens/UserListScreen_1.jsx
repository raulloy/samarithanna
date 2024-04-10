import axios from 'axios';
import { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import { getError } from '../utils';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        summary: action.payload,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};
export default function UserListScreen() {
  const [{ loading, error, summary }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(
          `https://samarithanna-api.onrender.com/api/orders/orders-tracking`,
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [userInfo]);

  console.log(summary);

  return (
    <div>
      <Helmet>
        <title>Usuarios</title>
      </Helmet>
      <h1>Usuarios Tracking</h1>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <div>
          <h2>Semana pasada</h2>
          <table className="table">
            <thead>
              <tr>
                <th>No.</th>
                <th>Email</th>
                <th>No. de Pedidos Promedio</th>
                <th>Frecuencia (días)</th>
                <th>No. de pedidos de la semana pasada</th>
              </tr>
            </thead>
            <tbody>
              {summary.ordersLastWeekByUser.map((user, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{user.user_email}</td>
                  <td>{user.avgOrders}</td>
                  <td>{user.daysFrequency}</td>
                  <td>{user.number_of_orders_last_week}</td>
                  <td></td>
                </tr>
              ))}
            </tbody>
          </table>
          <h2>Hace 2 semanas</h2>
          <table className="table">
            <thead>
              <tr>
                <th>No.</th>
                <th>Email</th>
                <th>No. de Pedidos Promedio</th>
                <th>Frecuencia (días)</th>
                <th>No. de pedidos de la semana pasada</th>
              </tr>
            </thead>
            <tbody>
              {summary.ordersLast_2_WeeksByUser.map((user, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{user.user_email}</td>
                  <td>{user.avgOrders}</td>
                  <td>{user.daysFrequency}</td>
                  <td>{user.number_of_orders_last_week}</td>
                  <td></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
