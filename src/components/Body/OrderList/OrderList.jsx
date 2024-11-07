import { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

import { Store } from '../../../Store';
import { apiURL, formatDate, getError } from '../../../utils';
import LoadingBox from '../LoadingBox/LoadingBox';
import MessageBox from '../MessageBox/MessageBox';
import { toast } from 'react-toastify';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        orders: action.payload,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const OrderList = () => {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, error, orders = [] }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
    orders: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`${apiURL}/api/orders`, {
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
    fetchData();
  }, [userInfo]);

  async function orderReadyHandler(estimatedDelivery, orderID) {
    if (!estimatedDelivery) return;
    try {
      dispatch({ type: 'FETCH_REQUEST' });
      const { data } = await axios.put(
        `${apiURL}/api/orders/${orderID}/ready`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );

      const updatedOrder = data.order;

      dispatch({
        type: 'FETCH_SUCCESS',
        payload: orders.map((order) => (order._id === updatedOrder._id ? updatedOrder : order)),
      });
      toast.success('Order is ready');
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'FETCH_FAIL' });
    }
  }

  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'user', headerName: 'Usuario', width: 150 },
    { field: 'date', headerName: 'Fecha', width: 150 },
    {
      field: 'total',
      headerName: 'Total',
      width: 120,
      type: 'number',
      headerAlign: 'center',
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
      renderCell: (params) => (
        <button type="button" className="transparent-btn" onClick={() => navigate(`/order/${params.row.id}`)}>
          Detalle
        </button>
      ),
    },
    {
      field: 'order_on_the_way',
      headerName: '',
      width: 200,
      sortable: false,
      renderCell: (params) =>
        params.row.isReady ? (
          'Correo enviado'
        ) : params.row.estimatedDelivery === 'No' ? (
          'Sin fecha de entrega'
        ) : (
          <button type="button" className="transparent-btn" onClick={() => orderReadyHandler(params.row.estimatedDelivery, params.row.id)}>
            Enviar aviso de salida
          </button>
        ),
    },
  ];

  const rows = orders.map((order) => ({
    id: order._id,
    user: order?.shippingAddress?.fullName || 'No name',
    date: order.createdAt ? order.createdAt.substring(0, 10) : '1970-01-01',
    total: order.totalPrice.toFixed(2),
    estimatedDelivery: order.estimatedDelivery ? formatDate(order.estimatedDelivery.substring(0, 10)) : 'No',
    deliveryStatus: order.deliveredAt ? formatDate(order.deliveredAt.substring(0, 10)) : 'No',
    isReady: order.isReady,
  }));

  return (
    <div className="mainContent">
      <Helmet>
        <title>Todos los Pedidos</title>
      </Helmet>
      <h2>Todos los Pedidos</h2> <br />
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
                color: 'green',
              },
              '& .MuiDataGrid-columnHeaderTitle': {
                fontWeight: 'bold',
              },
            }}
          />
        </Box>
      )}
    </div>
  );
};

export default OrderList;
