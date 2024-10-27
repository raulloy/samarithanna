import { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../../App.css';
import Axios from 'axios';

// Import our assets
import video from '../LoginAssets/video.mp4';
import logo from '../LoginAssets/logo.png';

//Imported Icons
import { FaUserShield } from 'react-icons/fa';
import { BsFillShieldLockFill } from 'react-icons/bs';
import { AiOutlineSwapRight } from 'react-icons/ai';
import { MdMarkEmailRead } from 'react-icons/md';

import { Store } from '../../Store';
import { apiURL, getError } from '../../utils';

const Register = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      const { data } = await Axios.post(`${apiURL}/api/users/signup`, {
        name,
        email,
        password,
      });
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
    <div className="registerPage flex">
      <div className="container flex">
        <div className="videoDiv" style={{ height: '100vh' }}>
          <video src={video} autoPlay muted loop></video>

          <div className="textDiv">
            <h2 className="title">Samarithanna</h2>
            <p>Productos Árabes Selectos</p>
          </div>

          <div className="footerDiv flex">
            <span className="text">¿Ya tienes una cuenta?</span>
            <Link to={'/signin'}>
              <button className="btn">Iniciar Sesión</button>
            </Link>
          </div>
        </div>

        <div className="formDiv flex">
          <div className="headerDiv" style={{ marginTop: 20 }}>
            <img src={logo} alt="Logo Image" />
            <h3>¡Regístrate!</h3>
          </div>

          <form action="" className="form grid">
            <div className="inputDiv">
              <label htmlFor="name">Nombre</label>
              <div className="input flex">
                <FaUserShield className="icon" />
                <input
                  type="text"
                  value={name}
                  id="name"
                  placeholder="Introduce tu nombre"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="inputDiv">
              <label htmlFor="email">Email</label>
              <div className="input flex">
                <MdMarkEmailRead className="icon" />
                <input
                  type="email"
                  value={email}
                  id="email"
                  placeholder="Introduce tu email"
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
                  value={password}
                  id="password"
                  placeholder="Introduce tu contraseña"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="inputDiv">
              <label htmlFor="confirmPassword">Confirma la contraseña</label>
              <div className="input flex">
                <BsFillShieldLockFill className="icon" />
                <input
                  type="password"
                  value={confirmPassword}
                  id="confirmPassword"
                  placeholder="Confirma la contraseña"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn flex"
              onClick={submitHandler}
              style={{ marginTop: 20 }}
            >
              <span>Registrarse</span>
              <AiOutlineSwapRight className="icon" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
