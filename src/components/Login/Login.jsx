import { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Axios from 'axios';

// Import our assets
import video from '../LoginAssets/video.mp4';
import logo from '../LoginAssets/logo.png';

//IMported Icons
import { FaUserShield } from 'react-icons/fa';
import { BsFillShieldLockFill } from 'react-icons/bs';
import { AiOutlineSwapRight } from 'react-icons/ai';

import { Store } from '../../Store';
import { apiURL, getError } from '../../utils';

const Login = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await Axios.post(`${apiURL}/api/users/signin`, {
        email,
        password,
      });

      if (!data.isAdmitted) {
        toast.error('Your account is not admitted. Please contact support.');
        return;
      }

      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate(redirect || '/');
    } catch (err) {
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  return (
    <div className="loginPage flex">
      <div className="container flex">
        <div className="videoDiv">
          <video src={video} autoPlay muted loop></video>

          <div className="textDiv">
            <h2 className="title">Samarithanna</h2>
            <p>Productos Árabes Selectos</p>
          </div>

          <div className="footerDiv flex">
            <span className="text">¿Aún no te has registrado?</span>
            <Link to={`/signup?redirect=${redirect}`}>
              <button className="btn">Registrarse</button>
            </Link>
          </div>
        </div>

        <div className="formDiv flex">
          <div className="headerDiv">
            <img src={logo} alt="Logo Image" />
            <h3>¡Bienvenido de nuevo!</h3>
          </div>

          <form className="form grid" onSubmit={submitHandler}>
            {/* <span className={statusHolder}>{loginStatus}</span> */}

            <div className="inputDiv">
              <label htmlFor="username">Email</label>
              <div className="input flex">
                <FaUserShield className="icon" />
                <input
                  type="email"
                  required
                  id="username"
                  placeholder="user@email.com"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="inputDiv">
              <label htmlFor="password">Contraseña</label>
              <div className="input flex">
                <BsFillShieldLockFill className="icon" />
                <input
                  type="password"
                  required
                  id="password"
                  placeholder="********"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="btn flex">
              <span>Iniciar Sesión</span>
              <AiOutlineSwapRight className="icon" />
            </button>

            <span className="forgotPassword">
              ¿Olvidaste tu contraseña? <a href="">Da clic aquí</a>
            </span>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
