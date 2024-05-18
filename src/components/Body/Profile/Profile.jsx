import { useContext, useReducer, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import axios from 'axios';

import { Store } from '../../../Store';
import { apiURL, getError } from '../../../utils';
import Top from '../Top Section/Top';
import Activity from '../Activity Section/Activity';

import './profile.css';

const reducer = (state, action) => {
  switch (action.type) {
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

const Profile = () => {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const [name, setName] = useState(userInfo.name);
  const [email, setEmail] = useState(userInfo.email);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
    loadingUpdate: false,
  });

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `${apiURL}/api/users/profile`,
        {
          name,
          email,
          password,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: 'UPDATE_SUCCESS',
      });
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success('User updated successfully');
    } catch (err) {
      dispatch({
        type: 'FETCH_FAIL',
      });
      toast.error(getError(err));
    }
  };
  return (
    <div className="mainContent">
      <Helmet>
        <title>User Profile</title>
      </Helmet>

      <Top />
      <div className="bottom flex">
        <div className="profile flex">
          <div className="container flex">
            <div className="formDiv flex">
              <div className="headerDiv">
                <h2>Perfil</h2>
              </div>
              <form className="form grid" onSubmit={submitHandler}>
                <div className="inputDiv">
                  <label htmlFor="name">Nombre</label>
                  <div className="input flex">
                    {/* <FaUserShield className="icon" /> */}
                    <input
                      type="text"
                      value={name}
                      required
                      id="name"
                      placeholder="Introduce tu nombre"
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="inputDiv">
                  <label htmlFor="address">Email</label>
                  <div className="input flex">
                    {/* <FaUserShield className="icon" /> */}
                    <input
                      type="email"
                      value={email}
                      required
                      id="email"
                      placeholder="Introduce tu email"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="inputDiv">
                  <label htmlFor="city">Contraseña</label>
                  <div className="input flex">
                    {/* <FaUserShield className="icon" /> */}
                    <input
                      type="password"
                      id="password"
                      placeholder="Introduce tu nueva contraseña"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
                <div className="inputDiv">
                  <label htmlFor="postalCode">Confirmar Contraseña</label>
                  <div className="input flex">
                    {/* <FaUserShield className="icon" /> */}
                    <input
                      type="password"
                      id="confirmPassword"
                      placeholder="Confirma tu nueva contraseña"
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>

                <button type="submit" className="btn flex">
                  <span>Continue</span>
                  {/* <AiOutlineSwapRight className="icon" /> */}
                </button>
              </form>
            </div>
          </div>
        </div>
        <Activity />
      </div>
    </div>
  );
};

export default Profile;
