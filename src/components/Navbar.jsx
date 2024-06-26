import React from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, userAttributes, logout } = useAuth();
    const state = useSelector(state => state.handleCart)
    const stateOfwish = useSelector(state => state.wishlist);
    const userWishlist = stateOfwish.wishlists[userAttributes.email] || [];
    
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light py-3 sticky-top">
            <div className="container">
                <NavLink className="navbar-brand fw-bold fs-4 px-2" to="/"> React Ecommerce</NavLink>
                <button className="navbar-toggler mx-2" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav m-auto my-2 text-center">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/">Home </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/product">Products</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/about">About</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/contact">Contact</NavLink>
                        </li>
                    </ul>
                    <div className="buttons text-center">
                        {user ? (
                            <>
                                <span className="navbar-text mx-2">Welcome,  {userAttributes.name}</span>
                                <button className="btn btn-outline-dark m-2" onClick={logout}>
                                    <i className="fa fa-sign-out-alt mr-1"></i> Logout
                                </button>
                                <NavLink to="/orderhistory" className="btn btn-outline-dark m-2">
                                    <i></i> OrderHistory
                                </NavLink>
                                <NavLink to="/wishlist" className="btn btn-outline-dark m-2">
                                    <i className="fa fa-cart-shopping mr-1"></i> Wishlist ({userWishlist.length})
                                </NavLink>
                            </>
                        ) : (
                            <>
                                <NavLink to="/login" className="btn btn-outline-dark m-2">
                                    <i className="fa fa-sign-in-alt mr-1"></i> Login
                                </NavLink>
                                <NavLink to="/register" className="btn btn-outline-dark m-2">
                                    <i className="fa fa-user-plus mr-1"></i> Register
                                </NavLink>
                            </>
                        )}
                        <NavLink to="/cart" className="btn btn-outline-dark m-2"><i className="fa fa-cart-shopping mr-1"></i> Cart ({state.length}) </NavLink>
                    </div>
                </div>


            </div>
        </nav>
    )
}

export default Navbar