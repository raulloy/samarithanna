import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './top.css';

// Imported Icons ===========>
import { BiSearchAlt } from 'react-icons/bi';
import { MdOutlineShoppingCart } from 'react-icons/md';
import { BsArrowRightShort } from 'react-icons/bs';
import { BsQuestionCircle } from 'react-icons/bs';

// Imported Image =========>
import img from '../../Assets/chef.png';
import arab_bakery from '../../Assets/pita-arab-cuisine-bakery.png';
import video from '../../Assets/video.mp4';

import { Store } from '../../../Store';

const Top = () => {
  const { state } = useContext(Store);
  const { cart, userInfo } = state;

  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const submitHandler = (e) => {
    e.preventDefault();
    navigate(query ? `/search/?query=${query}` : '/search');
  };

  return (
    <div className="topSection">
      <div className="headerSection flex">
        <div className="title">
          <h1>Welcome to Samarithanna.</h1>
          <p>Hi {userInfo.name}, Welcome back!</p>
        </div>

        <div className="searchBar flex">
          <form className="d-flex me-auto" onSubmit={submitHandler}>
            <input
              type="text"
              placeholder="Search products"
              id="searchBox"
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" id="button-search" className="search-btn">
              <BiSearchAlt className="icon" />
            </button>
          </form>
        </div>

        <div className="adminDiv flex">
          <div className="icon-wrapper">
            <Link to={'/cart'}>
              <MdOutlineShoppingCart className="icon" />
            </Link>
            <span className="cart-quantity">
              {cart.cartItems.reduce((acc, curr) => acc + curr.quantity, 0)}
            </span>
          </div>
          <div className="adminImage">
            <img src={img} alt="Admin Image" />
          </div>
        </div>
      </div>

      <div className="cardSection flex">
        <div className="rightCard flex">
          <h1>Productos Árabes Selectos</h1>
          <p>
            Bajo contenido en grasas saturadas. <br />
            Buena fuente de fibra.
          </p>

          <div className="buttons flex">
            {/* <button className="btn">Explore More</button>
            <button className="btn transparent">Top Sellers</button> */}
          </div>

          <div className="videoDiv">
            <video src={video} autoPlay loop muted></video>
          </div>
        </div>

        <div className="leftCard flex">
          <div className="main flex">
            <div className="textDiv">
              <h1>My Stats</h1>

              <div className="flex">
                <span>
                  Today <br /> <small>4 Orders</small>
                </span>
                <span>
                  This Month <br /> <small>175 Orders</small>
                </span>
              </div>

              <span className="flex link">
                Go to my orders <BsArrowRightShort className="icon" />
              </span>
            </div>

            <div className="imgDiv">
              <img src={arab_bakery} alt="Image Name" />
            </div>
          </div>

          {/* We shall use this card later .... */}
          <div className="sideBarCard">
            <BsQuestionCircle className="icon" />
            <div className="cardContent">
              <div className="circle1"></div>
              <div className="circle2"></div>

              <h3>Help Center</h3>
              <p>
                Having trouble in Planti, please contact us from for more
                questions.
              </p>

              <button className="btn">Go to help center</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Top;
