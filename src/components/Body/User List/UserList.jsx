import { useContext, useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

import LoadingBox from '../LoadingBox/LoadingBox';
import MessageBox from '../MessageBox/MessageBox';

import { Store } from '../../../Store';
import { apiURL, getError } from '../../../utils';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        users: action.payload,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const UserList = () => {
  const navigate = useNavigate();

  const [{ loading, error, users = [] }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
    users: [],
  });

  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`${apiURL}/api/users`, {
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

  const columns = [
    { field: 'id', headerName: 'ID', width: 50 },
    { field: 'name', headerName: 'Nombre', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'userType', headerName: 'Tipo de usuario', width: 150 },
    {
      field: 'daysFrequency',
      headerName: 'Frecuencia de compra',
      width: 180,
      type: 'number',
      align: 'center',
    },
    {
      field: 'minOrders',
      headerName: 'No. mínimo de pedidos',
      width: 200,
      type: 'number',
      align: 'center',
    },
    {
      field: 'isAdmitted',
      headerName: 'Admitido',
      width: 200,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'edit',
      headerName: '',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <button
          type="button"
          className="transparent-btn"
          onClick={() => navigate(`/admin/user/${params.row.id}`)}
        >
          Editar
        </button>
      ),
    },
  ];

  const rows = users.map((user) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    userType: user.userType,
    daysFrequency: user.daysFrequency,
    minOrders: user.minOrders,
    isAdmitted: user.isAdmitted ? '✅' : '❌',
  }));

  return (
    <div className="mainContent">
      <Helmet>
        <title>Usuarios</title>
      </Helmet>
      <h1>Usuarios</h1>
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
                color: 'green', // Toolbar button text color
              },
              '& .MuiDataGrid-columnHeaderTitle': {
                fontWeight: 'bold', // Bold header text
              },
            }}
          />
        </Box>
      )}
    </div>
  );
};

export default UserList;
