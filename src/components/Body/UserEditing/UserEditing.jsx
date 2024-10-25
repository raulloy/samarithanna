import { useContext, useEffect, useReducer, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import axios from 'axios';

import { Store } from '../../../Store';
import { apiURL, getError } from '../../../utils';
import LoadingBox from '../LoadingBox/LoadingBox';
import MessageBox from '../MessageBox/MessageBox';
import { AiOutlineSwapRight } from 'react-icons/ai';
import './UserEditing.css';

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
    default:
      return state;
  }
};

const UserEditing = () => {
  const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  const { state } = useContext(Store);
  const { userInfo } = state;

  const params = useParams();
  const { id: userId } = params;
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState('user'); // Default to 'user'
  const [isAdmitted, setIsAdmitted] = useState(false);
  const [daysFrequency, setDaysFrequency] = useState(7);
  const [minOrders, setMinOrders] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`${apiURL}/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setName(data.name);
        setEmail(data.email);
        setUserType(data.userType || 'user');
        setIsAdmitted(data.isAdmitted || false);
        setDaysFrequency(data.daysFrequency || 7);
        setMinOrders(data.minOrders || 1);
        dispatch({ type: 'FETCH_SUCCESS' });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [userId, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      await axios.put(
        `${apiURL}/api/users/${userId}`,
        {
          _id: userId,
          name,
          email,
          userType,
          isAdmitted,
          daysFrequency,
          minOrders,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: 'UPDATE_SUCCESS',
      });
      toast.success('User updated successfully');
      navigate('/admin/users');
    } catch (error) {
      toast.error(getError(error));
      dispatch({ type: 'UPDATE_FAIL' });
    }
  };

  return (
    <div className="mainContent">
      <div>
        <Helmet>
          <title>Editar Usuario</title>
        </Helmet>
        {/* <h2>Editar Usuario {userId.slice(-5)}</h2> */}

        {loading ? (
          <LoadingBox></LoadingBox>
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <div className="shippingAddress flex">
            <div className="container flex">
              <div className="formDiv flex">
                <div className="headerDiv">
                  <h3>Editar usuario</h3>
                </div>

                <form className="form grid" onSubmit={submitHandler}>
                  <div className="inputDiv">
                    <label htmlFor="name">Nombre</label>
                    <div className="input flex">
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="inputDiv">
                    <label htmlFor="email">Email</label>
                    <div className="input flex">
                      <input
                        value={email}
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="inputDiv">
                    <label htmlFor="userType">Tipo de usuario</label>
                    <div className="input flex">
                      <select
                        id="userType"
                        value={userType}
                        onChange={(e) => setUserType(e.target.value)}
                        required
                      >
                        <option value="admin">Admin</option>
                        <option value="delivery">Delivery</option>
                        <option value="user">User</option>
                      </select>
                    </div>
                  </div>
                  <div className="inputDiv">
                    <label htmlFor="isAdmitted">Admitido</label>
                    <div className="input flex">
                      <input
                        type="checkbox"
                        id="isAdmitted"
                        checked={isAdmitted}
                        onChange={(e) => setIsAdmitted(e.target.checked)}
                      />
                    </div>
                  </div>
                  <div className="inputDiv">
                    <label htmlFor="daysFrequency">Frecuencia de compra</label>
                    <div className="input flex">
                      <select
                        id="daysFrequency"
                        value={daysFrequency}
                        onChange={(e) => setDaysFrequency(e.target.value)}
                      >
                        <option value={7}>7</option>
                        <option value={14}>14</option>
                      </select>
                    </div>
                  </div>

                  <div className="inputDiv">
                    <label htmlFor="minOrders">Mínimo de pedidos</label>
                    <div className="input flex">
                      <input
                        type="number"
                        id="minOrders"
                        value={minOrders}
                        min={1}
                        onChange={(e) => setMinOrders(e.target.value)}
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn flex">
                    <span>Continue</span>
                    <AiOutlineSwapRight className="icon" />
                  </button>
                  {loadingUpdate && <LoadingBox></LoadingBox>}
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserEditing;
