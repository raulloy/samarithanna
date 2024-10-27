import { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './orderhistory.css';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

import { Store } from '../../../Store';
import { apiURL, formatDate, getError, getOrdersReducer } from '../../../utils';
import LoadingBox from '../LoadingBox/LoadingBox';
import MessageBox from '../MessageBox/MessageBox';

const OrderHistory = () => {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();

  const [{ loading, error, orders = [] }, dispatch] = useReducer(
    getOrdersReducer,
    {
      loading: true,
      error: '',
      orders: [],
    }
  );

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get(`${apiURL}/api/orders/mine`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(error),
        });
      }
    };
    fetchData();
  }, [userInfo]);

  const columns = [
    { field: 'id', headerName: 'ID', width: 100, editable: true },
    { field: 'date', headerName: 'Fecha', width: 150, editable: true },
    {
      field: 'total',
      headerName: 'Total',
      width: 120,
      type: 'number',
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'paymentStatus',
      headerName: 'Pagado',
      width: 180,
    },
    {
      field: 'estimatedDelivery',
      headerName: 'Fecha estimada de entrega',
      width: 240,
    },
    { field: 'deliveryStatus', headerName: 'Entregado', width: 180 },
    {
      field: 'details',
      headerName: '',
      width: 150,
      sortable: false,
      headerClassName: 'transparent-header',
      renderCell: (params) => (
        <button
          type="button"
          className="transparent-btn"
          onClick={() => navigate(`/order/${params.row.id}`)}
        >
          Details
        </button>
      ),
    },
  ];

  const rows = orders.map((order) => ({
    id: order._id,
    // date: formatDate(order.createdAt.substring(0, 10)),
    date: order.createdAt ? order.createdAt.substring(0, 10) : '1970-01-01',
    total: order.totalPrice.toFixed(2),
    // paymentStatus: order.isPaid ? formatDate(order.paidAt) : 'No',
    paymentStatus: order.isPaid ? 'Si' : 'No',
    estimatedDelivery: order.estimatedDelivery
      ? formatDate(order.estimatedDelivery.substring(0, 10))
      : 'No',
    deliveryStatus: order.deliveredAt
      ? formatDate(order.deliveredAt.substring(0, 10))
      : 'No',
  }));

  return (
    <div className="mainContent">
      <Helmet>
        <title>Mis Pedidos</title>
      </Helmet>
      <h2>Mis Pedidos</h2> <br />
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <Box sx={{ height: '90%', width: '100%', background: 'white' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            pageSizeOptions={[10, 25, 100]}
            checkboxSelection
            disableRowSelectionOnClick
            slots={{ toolbar: GridToolbar }}
            sx={{
              '& .MuiDataGrid-toolbarContainer .MuiButtonBase-root': {
                color: 'green', // Toolbar button text color to green
              },
              '& .MuiDataGrid-columnHeaderTitle': {
                fontWeight: 'bold', // Makes column header text bold
              },
            }}
          />
        </Box>
      )}
    </div>
  );
};

export default OrderHistory;
