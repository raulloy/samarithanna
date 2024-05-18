import { useContext, useEffect, useReducer, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import axios from 'axios';

import { Store } from '../../../Store';
import { apiURL, getError } from '../../../utils';
import LoadingBox from '../LoadingBox/LoadingBox';
import MessageBox from '../MessageBox/MessageBox';

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
    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true, successDelete: false };
    case 'DELETE_SUCCESS':
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false, successDelete: false };

    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };

    default:
      return state;
  }
};

const ProductEditing = () => {
  const navigate = useNavigate();
  const params = useParams(); // /product/:id
  const { id: productId } = params;

  const { state } = useContext(Store);
  const { userInfo } = state;
  const [
    { loading, error, loadingUpdate, loadingDelete, successDelete },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [productQty, setproductQty] = useState('');
  const [presentation, setPresentation] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`${apiURL}/api/products/${productId}`);
        setName(data.name);
        setSlug(data.slug);
        setproductQty(data.productQty);
        setPresentation(data.presentation);
        setPrice(data.price);
        setImage(data.image);
        setCategory(data.category);
        setDescription(data.description);
        dispatch({ type: 'FETCH_SUCCESS' });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [productId, successDelete]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      await axios.put(
        `${apiURL}/api/products/${productId}`,
        {
          _id: productId,
          name,
          slug,
          price,
          category,
          productQty,
          presentation,
          image,
          description,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: 'UPDATE_SUCCESS',
      });
      toast.success('Product updated successfully');
      navigate('/admin/products');
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'UPDATE_FAIL' });
    }
  };

  const deleteHandler = async () => {
    if (window.confirm('Are you sure to delete?')) {
      try {
        await axios.delete(`${apiURL}/api/products/${productId}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success('product deleted successfully');
        dispatch({ type: 'DELETE_SUCCESS' });
        navigate('/admin/products');
      } catch (err) {
        toast.error(getError(error));
        dispatch({
          type: 'DELETE_FAIL',
        });
      }
    }
  };

  return (
    <div className="mainContent">
      <div>
        <Helmet>
          <title>Editar Producto {productId.slice(-5)}</title>
        </Helmet>
        <h2>Editar</h2>

        {loading ? (
          <LoadingBox></LoadingBox>
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <div className="shippingAddress flex">
            <div className="container flex">
              <div className="formDiv flex">
                <div className="headerDiv">
                  <h3>Producto {productId.slice(-5)}</h3>
                </div>

                <form className="form grid" onSubmit={submitHandler}>
                  <div className="inputDiv">
                    <label htmlFor="name">Nombre</label>
                    <div className="input flex">
                      {/* <FaUserShield className="icon" /> */}
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="inputDiv">
                    <label htmlFor="address">Slug</label>
                    <div className="input flex">
                      {/* <MdLocationOn className="icon" /> */}
                      <input
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="inputDiv">
                    <label htmlFor="city">Contenido Neto</label>
                    <div className="input flex">
                      {/* <FaUserShield className="icon" /> */}
                      <input
                        value={productQty}
                        onChange={(e) => setproductQty(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="inputDiv">
                    <label htmlFor="postalCode">Presentación</label>
                    <div className="input flex">
                      {/* <FaUserShield className="icon" /> */}
                      <input
                        value={presentation}
                        onChange={(e) => setPresentation(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="inputDiv">
                    <label htmlFor="postalCode">Precio</label>
                    <div className="input flex">
                      {/* <FaUserShield className="icon" /> */}
                      <input
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="inputDiv">
                    <label htmlFor="postalCode">Imagen</label>
                    <div className="input flex">
                      {/* <FaUserShield className="icon" /> */}
                      <input
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="inputDiv">
                    <label htmlFor="postalCode">Categoría</label>
                    <div className="input flex">
                      {/* <FaUserShield className="icon" /> */}
                      <input
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="inputDiv">
                    <label htmlFor="postalCode">Descripción</label>
                    <div className="input flex">
                      {/* <FaUserShield className="icon" /> */}
                      <input
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn flex">
                    <span>Continuar</span>
                    {/* <AiOutlineSwapRight className="icon" /> */}
                  </button>
                  {loadingUpdate && <LoadingBox></LoadingBox>}
                  <button
                    type="button"
                    onClick={() => deleteHandler()}
                    className="btn flex"
                    style={{ background: 'red' }}
                  >
                    <span>Eliminar</span>
                    {/* <AiOutlineSwapRight className="icon" /> */}
                  </button>
                  {loadingDelete && <LoadingBox></LoadingBox>}
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductEditing;
