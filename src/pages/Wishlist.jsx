import React from 'react';
import { Footer, Navbar } from "../components";
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addCart, removeWishlistItem } from "../redux/action";

const Wishlist = () => {
    const { user, userAttributes } = useAuth();
    const stateOfwish = useSelector(state => state.wishlist);
    const userWishlist = stateOfwish.wishlists[userAttributes.email] || [];
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const addProduct = (product) => {
        dispatch(addCart(product));
    };

    const removeProductFromWishlist = (product) => {
        if (user) {
            dispatch(removeWishlistItem(userAttributes.email, product));
        } else {
            alert("Please log in to remove items from your wishlist.");
            navigate('/login');
        }
    };

    const EmptyWishlist = () => {
        return (
            <div className="container">
                <div className="row justify-content-center mt-5">
                    <div className="col-md-8 text-center">
                        <h4 className="text-secondary">Your Wishlist is Empty</h4>
                        <Link to="/" className="btn btn-outline-primary mt-3">
                            <i className="fa fa-arrow-left"></i> Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    };

    const ShowWishlist = () => {
        return (
            <div className="container mt-5">
                <div className="row">
                    <div className="col-12">
                        <table className="table table-bordered table-hover">
                            <thead className="thead-dark">
                                <tr>
                                    <th scope="col">Image</th>
                                    <th scope="col">Title</th>
                                    <th scope="col">Price</th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userWishlist.map(item => (
                                    <tr key={item.id}>
                                        <td>
                                            <Link to={"/product/" + item.id}>
                                                <img
                                                    src={item.image}
                                                    alt={item.title}
                                                    style={{ width: '100px', height: '75px', objectFit: 'cover' }}
                                                />
                                            </Link>
                                        </td>
                                        <td>{item.title}</td>
                                        <td>${item.price.toFixed(2)}</td>
                                        <td>
                                            <button className="btn btn-success mr-2" onClick={() => addProduct(item)}>Add to Cart</button>
                                            <button className="btn btn-danger" onClick={() => removeProductFromWishlist(item)}>Remove From Wishlist</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            <Navbar />
            <div className="wishlist-page" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
                <div className="container my-3 py-3">
                    <h1 className="text-center">Wishlist</h1>
                    <hr />
                    {userWishlist.length > 0 ? <ShowWishlist /> : <EmptyWishlist />}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Wishlist;
