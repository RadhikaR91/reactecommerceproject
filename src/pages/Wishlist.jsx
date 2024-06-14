import React from 'react';
import { Footer, Navbar } from "../components";
import { useAuth } from '../context/AuthContext';
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Wishlist = () => {
    const { userAttributes } = useAuth(); // Get the current userAtributes
    const stateOfwish = useSelector(state => state.wishlist);
    const userWishlist = stateOfwish.wishlists[userAttributes.email] || [];

    const EmptyWishlist = () => {
        return (
            <div className="container">
                <div className="row justify-content-center mt-5">
                    <div className="col-md-8 text-center">
                        <h4>Your Wishlist is Empty</h4>
                        <Link to="/" className="btn btn-outline-dark mt-3">
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
                            <thead>
                                <tr>
                                    <th scope="col">Image</th>
                                    <th scope="col">Title</th>
                                    <th scope="col">Price</th>
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
                                                width={100}
                                                height={75}
                                            />
                                            </Link>
                                        </td>
                                        <td>{item.title}</td>
                                        <td>${item.price}</td>
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
            <div className="wishlist-page">
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
