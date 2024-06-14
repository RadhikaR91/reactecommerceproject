import React, { useState, useEffect } from "react";
import { Footer, Navbar } from "../components";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { getToken } from "../services/authService";



const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const { userAttributes } = useAuth();
    const userEmail = userAttributes.email;


    useEffect(() => {
        const fetchOrders = async () => {
            if (!userEmail) return;
            const token = await getToken();

            try {
                const encodedEmail = encodeURIComponent(userEmail);
                const response = await fetch(`https://i7uzvh22n7.execute-api.us-east-1.amazonaws.com/Test/getOrders?useremail=${encodedEmail}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": token
                    }
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log(data);
                setOrders(data);
            } catch (error) {
                console.error('Error fetching order history:', error);
            }
        };

        fetchOrders();
    }, [userEmail]);

    const renderOrderItems = (items) => {
        return items.map((item) => (
            <tr key={item.product_id}>
                <td>
                    <div className="bg-image rounded" data-mdb-ripple-color="light">
                        <img
                            src={item.image}
                            alt={item.title}
                            width={100}
                            height={75}
                        />
                    </div>
                </td>
                <td>{item.title}</td>
                <td>{item.quantity}</td>
                <td>${item.total_price}</td>
            </tr>
        ));
    };

    const renderOrders = () => {
        return orders.map((order) => (
            <div key={order.orderId} className="card mb-4">
                <div className="card-header py-3 d-flex justify-content-between align-items-center">
                    <div>
                        <h6 className="mb-0">Order ID: {order.orderId}</h6>
                    </div>
                    <div>
                        <h6 className="text-end">Order Date : {order.createdAt}</h6>
                    </div>
                </div>
                <div className="card-body">
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Title</th>
                                <th>Quantity</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderOrderItems(order.items)}
                        </tbody>
                    </table>
                    <div className="text-end">
                        <p><strong>Shipping : $30</strong></p>
                    </div>
                    <div className="text-end">
                        <p><strong>Total Price: ${order.totalAmount}</strong></p>
                    </div>
                </div>
            </div>
        ));
    };

    return (
        <>
            <Navbar />
            <div className="container my-3 py-3">
                <h1 className="text-center">Order History</h1>
                <hr />
                {orders.length > 0 ? (
                    renderOrders()
                ) : (
                    <div className="text-center">
                        <h4>Your order history is empty</h4>
                        <Link to="/" className="btn btn-outline-dark mx-4">
                            <i className="fa fa-arrow-left"></i> Go Back to Shopping
                        </Link>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default OrderHistory;