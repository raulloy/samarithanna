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
    default:
      return state;
  }
};

const DashboardScreen = () => {
  const [{ loading, summary, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
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
        console.log(err);
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [userInfo]);

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
                  <p className="card-text">Users</p>
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
                  <p className="card-text">Orders</p>
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
                  <p className="card-text">Sales</p>
                </div>
              </div>
            </div>
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
            <h2>Monthly Sales</h2>
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
            <h2>Sales by products</h2>
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
