import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store } from '../../../Store';
import { Helmet } from 'react-helmet-async';

import './shippingaddress.css';

//Imported Icons
import { FaUserShield } from 'react-icons/fa';
import { MdLocationOn } from 'react-icons/md';

const ShippingAddress = () => {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    userInfo,
    cart: { shippingAddress },
  } = state;

  const [fullName, setFullName] = useState(shippingAddress.fullName || '');
  const [address, setAddress] = useState(shippingAddress.address || '');
  // const [city, setCity] = useState(shippingAddress.city || '');
  // const [postalCode, setPostalCode] = useState(
  //   shippingAddress.postalCode || ''
  // );

  useEffect(() => {
    if (!userInfo) {
      navigate('/signin?redirect=/shipping');
    }
  }, [userInfo, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: {
        fullName,
        address,
      },
    });
    localStorage.setItem(
      'shippingAddress',
      JSON.stringify({
        fullName,
        address,
      })
    );
    navigate('/place-order');
  };

  return (
    <div className="mainContent">
      <Helmet>
        <title>Shipping Address</title>
      </Helmet>
      <div className="shippingAddress flex">
        <div className="container flex">
          <div className="formDiv flex">
            <div className="headerDiv">
              <h3>Shipping Address</h3>
            </div>

            <form className="form grid" onSubmit={submitHandler}>
              <div className="inputDiv">
                <label htmlFor="name">Full Name</label>
                <div className="input flex">
                  <FaUserShield className="icon" />
                  <input
                    type="text"
                    value={fullName}
                    required
                    id="name"
                    placeholder="Enter your name"
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
              </div>
              <div className="inputDiv">
                <label htmlFor="address">Address</label>
                <div className="input flex">
                  <MdLocationOn className="icon" />
                  <input
                    type="text"
                    value={address}
                    required
                    id="address"
                    placeholder="Enter your address"
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </div>
              {/* <div className="inputDiv">
                <label htmlFor="city">City</label>
                <div className="input flex">
                  <FaUserShield className="icon" />
                  <input
                    type="text"
                    value={city}
                    required
                    id="city"
                    placeholder="Enter your address"
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
              </div>
              <div className="inputDiv">
                <label htmlFor="postalCode">PostalCode</label>
                <div className="input flex">
                  <FaUserShield className="icon" />
                  <input
                    type="text"
                    value={postalCode}
                    required
                    id="postalCode"
                    placeholder="Enter your address"
                    onChange={(e) => setPostalCode(e.target.value)}
                  />
                </div>
              </div> */}

              <button type="submit" className="btn flex">
                <span>Continue</span>
                {/* <AiOutlineSwapRight className="icon" /> */}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingAddress;
