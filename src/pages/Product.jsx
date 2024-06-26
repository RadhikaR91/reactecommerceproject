import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { Link, useParams, useNavigate } from "react-router-dom";
import Marquee from "react-fast-marquee";
import { useDispatch, useSelector } from "react-redux";
import { addCart, addWishlistItem, removeWishlistItem } from "../redux/action";
import awsApiConfig from '../services/aws-api';
import { useAuth } from "../context/AuthContext";
import { Footer, Navbar } from "../components";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isCompareVisible, setIsCompareVisible] = useState(false);
  const { user, userAttributes } = useAuth();
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const addProduct = (product) => {
    dispatch(addCart(product));
  };

  const stateOfwish = useSelector(state => state.wishlist);
  const userWishlist = stateOfwish.wishlists[userAttributes.email] || [];

  const addProductToWishlist = (product) => {
    if (user) {
      dispatch(addWishlistItem(userAttributes.email, product));
    } else {
      alert("Please log in to add items to your wishlist.");
      navigate('/login');
    }
  }

  const removeProductFromWishlist = (product) => {
    if (user) {
      dispatch(removeWishlistItem(userAttributes.email, product));
    } else {
      alert("Please log in to remove items from your wishlist.");
      navigate('/login');
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const getProduct = async () => {
      setLoading(true);
      setLoading2(true);
      const response = await fetch(`https://dwiifs4cia.execute-api.us-east-1.amazonaws.com/Prod/product/${id}`, {
        headers: {
          'x-api-key': awsApiConfig.apiKey
        }
      });
      const data = await response.json();
      setProduct(data);
      setLoading(false);
      const response2 = await fetch(
        `https://dwiifs4cia.execute-api.us-east-1.amazonaws.com/Prod/product/category/${data.category}`, {
        headers: {
          'x-api-key': awsApiConfig.apiKey
        }
      });

      const data2 = await response2.json();
      setSimilarProducts(data2);
      setLoading2(false);
    };
    getProduct();
  }, [id]);


  // Navigate to compare page 
  const navigateToComparePage = () => {
    navigate('/compare', { state: { selectedProducts, mainProduct: product } });
  };

  const Loading = () => {
    return (
      <>
        <div className="container my-5 py-2">
          <div className="row">
            <div className="col-md-6 py-3"><Skeleton height={400} width={400} /></div>
            <div className="col-md-6 py-5">
              <Skeleton height={30} width={250} />
              <Skeleton height={90} />
              <Skeleton height={40} width={70} />
              <Skeleton height={50} width={110} />
              <Skeleton height={120} />
              <Skeleton height={40} width={110} inline={true} />
              <Skeleton className="mx-3" height={40} width={110} />
            </div>
          </div>
        </div>
      </>
    );
  };


  const isProductInWishlist = userWishlist.find(item => item.id === product.id);

  const ShowProduct = () => {
    return (
      <>
        <div className="container my-5 py-2">
          <div className="row">
            <div className="col-md-6 col-sm-12 py-3">
              <img className="img-fluid" src={product.image} alt={product.title} width="400px" height="400px" />
            </div>
            <div className="col-md-6 col-md-6 py-5">
              <h4 className="text-uppercase text-muted">{product.category}</h4>
              <h1 className="display-5">{product.title}</h1>
              <p className="lead">{product.rating && product.rating.rate}{" "}<i className="fa fa-star"></i></p>
              <h3 className="display-6  my-4">${product.price}</h3>
              <p className="lead">{product.description}</p>
              <button className="btn btn-outline-dark" onClick={() => addProduct(product)}> Add to Cart</button>
              <Link to="/cart" className="btn btn-dark mx-3"> Go to Cart</Link>
              <button className="btn btn-dark m-1" onClick={() => {
                if (!isProductInWishlist) {
                  addProductToWishlist(product)
                } else {
                  removeProductFromWishlist(product)
                }
              }}>
                <FontAwesomeIcon
                  icon={isProductInWishlist ? faHeartSolid : faHeartRegular}
                  style={{ color: isProductInWishlist ? 'red' : 'gray' }}
                />
              </button>
            </div>
          </div>
        </div>
      </>
    );
  };

  const Loading2 = () => {
    return (
      <>
        <div className="my-4 py-4">
          <div className="d-flex">
            <div className="mx-4"><Skeleton height={400} width={250} /></div>
            <div className="mx-4"><Skeleton height={400} width={250} /></div>
            <div className="mx-4"><Skeleton height={400} width={250} /></div>
            <div className="mx-4"><Skeleton height={400} width={250} /></div>
          </div>
        </div>
      </>
    );
  };



  const ShowSimilarProduct = ({ selectedProducts, setSelectedProducts }) => {
    const handleCheckboxChange = (item) => {
      setSelectedProducts((prev) => {
        if (prev.includes(item)) {
          return prev.filter((prod) => prod !== item);
        } else if (prev.length < 2) {
          return [...prev, item];
        }
        return prev;
      });
    };

    useEffect(() => {
      setIsCompareVisible(selectedProducts.length > 0);
    }, [selectedProducts]);

    // Filter out the main product from similar products list
    const filteredSimilarProducts = similarProducts.filter((item) => item.id !== product.id);

    return (
      <>
        <div className="py-4 my-4">
          <div className="d-flex">
            {filteredSimilarProducts.map((item) => {
              const isProductInWishlist = userWishlist.find(x => x.id === item.id);
              return (
                <div key={item.id} className="card mx-4 text-center">
                  <Link to={"/product/" + item.id}>
                    <img
                      className="card-img-top p-3"
                      src={item.image}
                      alt="Card"
                      height={300}
                      width={300}
                    />
                  </Link>
                  <div className="card-body">
                    <h5 className="card-title">{item.title.substring(0, 15)}...</h5>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(item)}
                        onChange={() => handleCheckboxChange(item)}
                      />
                      <label style={{ fontSize: 'small', fontWeight: 'bold' }}>Compare</label>
                    </div>
                  </div>
                  {/* <ul className="list-group list-group-flush">
                    <li className="list-group-item lead">${product.price}</li>
                  </ul> */}
                  <div className="card-body">
                    <Link to={"/product/" + item.id} className="btn btn-dark m-1">View Details</Link>
                    <button className="btn btn-dark m-1"onClick={() => addProduct(item)}>Add to Cart</button>
                    <button className="btn btn-dark m-1" onClick={() => {
                      if (!isProductInWishlist) {
                        addProductToWishlist(item)
                      } else {
                        removeProductFromWishlist(item)
                      }
                    }}>
                      <FontAwesomeIcon
                        icon={isProductInWishlist ? faHeartSolid : faHeartRegular}
                        style={{ color: isProductInWishlist ? 'red' : 'gray' }}
                      />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  };
  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row">{loading ? <Loading /> : <ShowProduct />}</div>
        <div className="row my-5 py-5">
          <div className="d-none d-md-block">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <h2 className="me-3">You may also Like</h2>
                {isCompareVisible && (
                  <button className="btn btn-dark" onClick={navigateToComparePage}>Compare Products</button>
                )}
              </div>
            </div>
            <Marquee pauseOnHover={true} pauseOnClick={true} speed={50}>
              {loading2 ? <Loading2 /> : <ShowSimilarProduct selectedProducts={selectedProducts} setSelectedProducts={setSelectedProducts} />}
            </Marquee>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Product;
