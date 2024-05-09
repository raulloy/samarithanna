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
// import { BiTrendingUp } from 'react-icons/bi';
// import { MdOutlinePermContactCalendar } from 'react-icons/md';
// import { BsCreditCard2Front } from 'react-icons/bs';
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
          {userInfo && userInfo.isAdmin && (
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
              <span className="smallText">My Orders</span>
            </Link>
          </li>

          {userInfo && userInfo.isAdmin && (
            <li className="listItem">
              <Link to="/admin/orders" className="menuLink flex">
                <FaList className="icon" />
                <span className="smallText">Orders</span>
              </Link>
            </li>
          )}

          {userInfo && userInfo.isAdmin && (
            <li className="listItem">
              <Link to="/admin/products" className="menuLink flex">
                <FaStore className="icon" />
                <span className="smallText">Products</span>
              </Link>
            </li>
          )}
        </ul>
      </div>

      <div className="settingsDiv">
        <h3 className="divTitle">SETTINGS</h3>
        <ul className="menuLists grid">
          <li className="listItem">
            <Link to="/profile" className="menuLink flex">
              <AiOutlineUser className="icon" />
              <span className="smallText">Profile</span>
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
              <span className="smallText">Log Out</span>
            </Link>
          </li>
        </ul>
      </div>

      <div className="sideBarCard">
        <BsQuestionCircle className="icon" />
        <div className="cardContent">
          <div className="circle1"></div>
          <div className="circle2"></div>

          <h3>Help Center</h3>
          <p>Having trouble with your order?, please contact us.</p>

          <button className="btn">Go to help center</button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
