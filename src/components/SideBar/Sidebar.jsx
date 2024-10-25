import { useContext } from 'react';
import { Link } from 'react-router-dom';
import './sidebar.css';

// Imported Images ==========>
import logo from '../../assets/logo.png';

// imported Icons ===========>
import { IoMdSpeedometer } from 'react-icons/io';
import { MdDeliveryDining } from 'react-icons/md';
import { FaStore } from 'react-icons/fa';
import { FaList } from 'react-icons/fa';
import { AiOutlineUser } from 'react-icons/ai';
import { FaUser } from 'react-icons/fa';
import { BsQuestionCircle } from 'react-icons/bs';
import { BsFillArrowLeftCircleFill } from 'react-icons/bs';

import { Store } from '../../Store';

const Sidebar = () => {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const { dispatch: ctxDispatch } = useContext(Store);

  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    // localStorage.removeItem('shippingAddress');
  };

  return (
    <div className="sideBar grid">
      <Link to="/">
        <div className="logoDiv flex">
          <img src={logo} alt="Image Name" />
          <h2>Samarithanna</h2>
        </div>
      </Link>

      <div className="menuDiv">
        <h3 className="divTitle">MENU</h3>
        <ul className="menuLists grid">
          {userInfo && userInfo.userType === 'admin' && (
            <li className="listItem">
              <Link to="/admin/dashboard" className="menuLink flex">
                <IoMdSpeedometer className="icon" />
                <span className="smallText">Dashboard</span>
              </Link>
            </li>
          )}

          <li className="listItem">
            <Link to="/orderhistory" className="menuLink flex">
              <MdDeliveryDining className="icon" />
              <span className="smallText">Mis pedidos</span>
            </Link>
          </li>

          {userInfo &&
            (userInfo.userType === 'admin' ||
              userInfo.userType === 'delivery') && (
              <li className="listItem">
                <Link to="/admin/orders" className="menuLink flex">
                  <FaList className="icon" />
                  <span className="smallText">Pedidos</span>
                </Link>
              </li>
            )}

          {userInfo && userInfo.userType === 'admin' && (
            <li className="listItem">
              <Link to="/admin/products" className="menuLink flex">
                <FaStore className="icon" />
                <span className="smallText">Productos</span>
              </Link>
            </li>
          )}

          {userInfo && userInfo.userType === 'admin' && (
            <li className="listItem">
              <Link to="/admin/users" className="menuLink flex">
                <FaUser className="icon" />
                <span className="smallText">Usuarios</span>
              </Link>
            </li>
          )}
        </ul>
      </div>

      <div className="settingsDiv">
        <h3 className="divTitle">Configuración</h3>
        <ul className="menuLists grid">
          <li className="listItem">
            <Link to="/profile" className="menuLink flex">
              <AiOutlineUser className="icon" />
              <span className="smallText">Perfil</span>
            </Link>
          </li>

          {/* <li className="listItem">
            <a href="#" className="menuLink flex">
              <BiTrendingUp className="icon" />
              <span className="smallText">Trends</span>
            </a>
          </li>

          <li className="listItem">
            <a href="#" className="menuLink flex">
              <MdOutlinePermContactCalendar className="icon" />
              <span className="smallText">Contact</span>
            </a>
          </li>

          <li className="listItem">
            <a href="#" className="menuLink flex">
              <BsCreditCard2Front className="icon" />
              <span className="smallText">Billing</span>
            </a>
          </li> */}

          <li className="listItem logOutBtn">
            <Link
              to="/signin?redirect=/"
              onClick={signoutHandler}
              className="menuLink flex"
            >
              <BsFillArrowLeftCircleFill className="icon" />
              <span className="smallText">Cerrar Sesión</span>
            </Link>
          </li>
        </ul>
      </div>

      <div className="sideBarCard">
        <BsQuestionCircle className="icon" />
        <div className="cardContent">
          <div className="circle1"></div>
          <div className="circle2"></div>

          <h3>¿Necesitas ayuda?</h3>
          <p>¿Necesitas ayuda con tu pedido? Ponte en contacto con nosotros.</p>

          <button className="btn">Contactar</button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
