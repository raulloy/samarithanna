import { useContext, useEffect, useReducer } from 'react';
import Chart from 'react-google-charts';
import axios from 'axios';

import './DashboardScreen.css';

import { Store } from '../../../Store';
import { apiURL, chartOptions, getError } from '../../../utils';
import LoadingBox from '../LoadingBox/LoadingBox';
import MessageBox from '../MessageBox/MessageBox';

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
    case 'FETCH_TRACKING_REQUEST':
      return { ...state, trackingLoading: true };
    case 'FETCH_TRACKING_SUCCESS':
      return {
        ...state,
        dailyUserTracking: action.payload || [],
        trackingLoading: false,
      };
    case 'FETCH_TRACKING_FAIL':
      return {
        ...state,
        trackingLoading: false,
        trackingError: action.payload,
      };
    case 'FETCH_TRACKING_REQUEST_2':
      return { ...state, trackingLoading: true };
    case 'FETCH_TRACKING_SUCCESS_2':
      return {
        ...state,
        dailyUserTracking_2: action.payload || [],
        trackingLoading: false,
      };
    case 'FETCH_TRACKING_FAIL_2':
      return {
        ...state,
        trackingLoading: false,
        trackingError: action.payload,
      };
    default:
      return state;
  }
};

const DashboardScreen = () => {
  const [
    {
      loading,
      summary,
      error,
      trackingLoading,
      dailyUserTracking,
      dailyUserTracking_2,
      trackingError,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    trackingLoading: true,
    error: '',
    trackingError: '',
    dailyUserTracking: [], // Inicializa dailyUserTracking como un array vacío
    dailyUserTracking_2: [], // Inicializa dailyUserTracking como un array vacío
  });
  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${apiURL}/api/orders/summary`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };

    const fetchDailyUserTracking = async () => {
      try {
        const { data } = await axios.get(
          `${apiURL}/api/orders/users-daily-tracking`,
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        console.log('Fetched daily user tracking:', data);
        dispatch({ type: 'FETCH_TRACKING_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'FETCH_TRACKING_FAIL',
          payload: getError(err),
        });
      }
    };

    const fetchDailyUserTracking_2 = async () => {
      try {
        const { data } = await axios.get(
          `${apiURL}/api/orders/users-daily-tracking-2`,
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        console.log('Fetched daily user tracking:', data);
        dispatch({ type: 'FETCH_TRACKING_SUCCESS_2', payload: data });
      } catch (err) {
        dispatch({
          type: 'FETCH_TRACKING_FAIL_2',
          payload: getError(err),
        });
      }
    };

    fetchData();
    fetchDailyUserTracking();
    fetchDailyUserTracking_2();
  }, [userInfo]);

  console.log('dailyUserTracking', dailyUserTracking);
  console.log('dailyUserTracking_2', dailyUserTracking_2);

  return (
    <div className="mainContent">
      <h1>Dashboard</h1> <br />
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <div className="dashboard">
          <div className="row">
            <div className="col">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">
                    {summary.users && summary.users[0]
                      ? summary.users[0].numUsers
                      : 0}
                  </h5>
                  <p className="card-text">Usuarios</p>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">
                    {summary.orders && summary.users[0]
                      ? summary.orders[0].numOrders
                      : 0}
                  </h5>
                  <p className="card-text">Pedidos</p>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">
                    $
                    {summary.orders && summary.users[0]
                      ? summary.orders[0].totalSales.toLocaleString('es-MX', {
                          minimumFractionDigits: 2,
                        })
                      : 0}
                  </h5>
                  <p className="card-text">Ventas</p>
                </div>
              </div>
            </div>
          </div>
          <div className="chart-container">
            <h2>Seguimiento semanal de pedidos por usuario</h2>
            {trackingLoading ? (
              <div>Loading...</div>
            ) : trackingError ? (
              <div>{trackingError}</div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Usuario</th>
                    <th>Lunes</th>
                    <th>Martes</th>
                    <th>Miércoles</th>
                    <th>Jueves</th>
                    <th>Viernes</th>
                    <th>Sábado</th>
                    <th>Domingo</th>
                  </tr>
                </thead>
                <tbody>
                  {dailyUserTracking.map((user, index) => (
                    <tr
                      key={index}
                      style={{
                        background:
                          user.totalOrders >= user.minOrders
                            ? // ? '#e5c6ce'
                              '#CBFFA5'
                            : 'white',
                      }}
                    >
                      <td>{user.userName}</td>
                      <td>{user.orders.Monday}</td>
                      <td>{user.orders.Tuesday}</td>
                      <td>{user.orders.Wednesday}</td>
                      <td>{user.orders.Thursday}</td>
                      <td>{user.orders.Friday}</td>
                      <td>{user.orders.Saturday}</td>
                      <td>{user.orders.Sunday}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div className="chart-container">
            <h2>Seguimiento quincenal de pedidos por usuario</h2>
            {trackingLoading ? (
              <div>Loading...</div>
            ) : trackingError ? (
              <div>{trackingError}</div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th rowSpan="2">Usuario</th>
                    <th colSpan="7">Semana Pasada</th>
                    <th colSpan="7">Semana Actual</th>
                  </tr>
                  <tr>
                    <th>Lunes</th>
                    <th>Martes</th>
                    <th>Miércoles</th>
                    <th>Jueves</th>
                    <th>Viernes</th>
                    <th>Sábado</th>
                    <th>Domingo</th>
                    <th>Lunes</th>
                    <th>Martes</th>
                    <th>Miércoles</th>
                    <th>Jueves</th>
                    <th>Viernes</th>
                    <th>Sábado</th>
                    <th>Domingo</th>
                  </tr>
                </thead>
                <tbody>
                  {dailyUserTracking_2.map((user, index) => (
                    <tr
                      key={index}
                      style={{
                        background:
                          user.lastWeek.totalOrders +
                            user.currentWeek.totalOrders >=
                          user.minOrders
                            ? '#CBFFA5'
                            : 'white',
                      }}
                    >
                      <td>{user.userName}</td>
                      <td>{user.lastWeek.orders.Monday}</td>
                      <td>{user.lastWeek.orders.Tuesday}</td>
                      <td>{user.lastWeek.orders.Wednesday}</td>
                      <td>{user.lastWeek.orders.Thursday}</td>
                      <td>{user.lastWeek.orders.Friday}</td>
                      <td>{user.lastWeek.orders.Saturday}</td>
                      <td>{user.lastWeek.orders.Sunday}</td>
                      <td>{user.currentWeek.orders.Monday}</td>
                      <td>{user.currentWeek.orders.Tuesday}</td>
                      <td>{user.currentWeek.orders.Wednesday}</td>
                      <td>{user.currentWeek.orders.Thursday}</td>
                      <td>{user.currentWeek.orders.Friday}</td>
                      <td>{user.currentWeek.orders.Saturday}</td>
                      <td>{user.currentWeek.orders.Sunday}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          {/* <div className="chart-container">
            <h2>Sales</h2>
            {summary.dailyOrders && summary.dailyOrders.length === 0 ? (
              <div>No Sales</div>
            ) : (
              <Chart
                width="100%"
                height="400px"
                chartType="AreaChart"
                options={chartOptions}
                loader={<div>Loading Chart...</div>}
                data={[
                  ['Date', 'Sales', { role: 'annotation' }],
                  ...summary.dailyOrders.map((x) => [x._id, x.sales, x.orders]),
                ]}
              />
            )}
          </div> */}
          <div className="chart-container">
            <h2>Ventas por mes</h2>
            {summary.monthlyOrders && summary.monthlyOrders.length === 0 ? (
              <div>No Sales</div>
            ) : (
              <Chart
                width="100%"
                height="400px"
                chartType="AreaChart"
                options={chartOptions}
                loader={<div>Loading Chart...</div>}
                data={[
                  ['Date', 'Sales', { role: 'annotation' }],
                  ...summary.monthlyOrders.map((x) => [
                    x._id.slice(0, 7),
                    x.monthlySales,
                    x.numMonthlyOrders.toString(),
                  ]), // Formats 'YYYY-MM'
                ]}
              />
            )}
          </div>
          <div className="chart-container">
            <h2>Ventas por producto</h2>
            {summary.productCategories &&
            summary.productCategories.length === 0 ? (
              <div>No Categories</div>
            ) : (
              <Chart
                width="100%"
                height="400px"
                chartType="BarChart"
                options={{
                  ...chartOptions,
                  chartArea: { width: '60%', height: '80%' },
                }}
                loader={<div>Loading Chart...</div>}
                data={[
                  ['Product', 'Quantity Sold', { role: 'annotation' }],
                  ...summary.itemsSoldByProduct.map((item) => [
                    item.productName,
                    item.totalQuantity,
                    item.totalQuantity.toString(),
                  ]),
                ]}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardScreen;
