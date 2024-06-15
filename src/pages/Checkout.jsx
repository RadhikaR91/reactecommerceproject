import React from "react";
import { Footer, Navbar } from "../components";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from '../context/AuthContext';
import { clearCart } from "../redux/action";
import { getToken } from "../services/authService";


const OrderSuccess = () => {
  return (
    <div className="container my-5 py-5 text-center">
      <h1>Thank you for your order!</h1>
      <p>Your order has been placed successfully.</p>
      <Link to="/" className="btn btn-primary">Go to Home</Link>
    </div>
  );
};


const Checkout = () => {
  const state = useSelector((state) => state.handleCart);
  const { userAttributes } = useAuth();
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [orderPlaced, setOrderPlaced] = React.useState(false);

  console.log(userAttributes.email);
  const onSubmit = async (data) => {

    let subtotal = 0;
    let shipping = 30;
    let totalItems = 0;
    state.map((item) => {
      subtotal += Number(item.price) * item.qty;
      totalItems += item.qty;
      return null;
    });

    // Prepare order data
    const totalAmount = subtotal + shipping;
    const orderDetails = {
      customer_name: `${data.firstName} ${data.lastName}`,
      email: userAttributes.email,
      items: state.map(item => ({
        product_id: item.id,
        quantity: item.qty,
        image: item.image,
        total_price: Number(item.price) * item.qty,
        title: item.title
      })),
      total_items: totalItems,
      subtotal: subtotal,
      total_amount: totalAmount
    };

    const token = await getToken();
    console.log("Token", token);
    try {
      const response = await fetch('https://i7uzvh22n7.execute-api.us-east-1.amazonaws.com/Test/putOrders', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        },
        body: JSON.stringify(orderDetails),
      });

      if (response.ok) {
        reset();
        console.log(response);
        dispatch(clearCart());
        setOrderPlaced(true);
      } else {
        alert("Failed to process the order. Please try again.");
      }
    } catch (error) {
      console.error("Error placing order", error);
      alert("There was an error placing your order. Please try again.");
    }
  };

  const EmptyCart = () => {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-12 py-5 bg-light text-center">
            <h4 className="p-3 display-5">No item in Cart</h4>
            <Link to="/" className="btn btn-outline-dark mx-4">
              <i className="fa fa-arrow-left"></i> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  };

  const ShowCheckout = () => {
    let subtotal = 0;
    let shipping = 30.0;
    let totalItems = 0;
    state.map((item) => {
      return (subtotal += item.price * item.qty);
    });

    state.map((item) => {
      return (totalItems += item.qty);
    });
    return (
      <>
        <div className="container py-5">
          <div className="row my-4">
            <div className="col-md-5 col-lg-4 order-md-last">
              <div className="card mb-4">
                <div className="card-header py-3 bg-light">
                  <h5 className="mb-0">Order Summary</h5>
                </div>
                <div className="card-body">
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                      Products ({totalItems})<span>${Math.round(subtotal)}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                      Shipping
                      <span>${shipping}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                      <div>
                        <strong>Total amount</strong>
                      </div>
                      <span>
                        <strong>${Math.round(subtotal + shipping)}</strong>
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-7 col-lg-8">
              <div className="card mb-4">
                <div className="card-header py-3">
                  <h4 className="mb-0">Billing address</h4>
                </div>
                <div className="card-body">
                  <form onSubmit={handleSubmit(onSubmit)} className="needs-validation" novalidate>
                    <div className="row g-3">
                      <div className="col-sm-6 my-1">
                        <label for="firstName" className="form-label">
                          First name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="firstName"
                          {...register("firstName", { required: true })}
                        />
                        {errors.firstName && <div className="invalid-feedback">
                          Valid first name is required.
                        </div>}
                      </div>

                      <div className="col-sm-6 my-1">
                        <label for="lastName" className="form-label">
                          Last name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="lastName"
                          {...register("lastName", { required: true })}
                        />
                        {errors.lastName && <div className="invalid-feedback">
                          Valid last name is required.
                        </div>}
                      </div>

                      <div className="col-12 my-1">
                        <label for="email" className="form-label">
                          Email
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          placeholder="you@example.com"
                          {...register("email", { required: true })}
                        />
                        {errors.email && <div className="invalid-feedback">
                          Please enter a valid email address for shipping
                          updates.
                        </div>}
                      </div>

                      <div className="col-12 my-1">
                        <label for="address" className="form-label">
                          Address
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="address"
                          placeholder="1234 Main St"

                        />
                        <div className="invalid-feedback">
                          Please enter your shipping address.
                        </div>
                      </div>

                      <div className="col-12">
                        <label for="address2" className="form-label">
                          Address 2{" "}
                          <span className="text-muted">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="address2"
                          placeholder="Apartment or suite"

                        />
                      </div>

                      <div className="col-md-5 my-1">
                        <label for="country" className="form-label">
                          Country
                        </label>
                        <br />
                        <select className="form-select" id="country"

                          required>
                          <option value="">Choose...</option>
                          <option>USA</option>
                        </select>
                        <div className="invalid-feedback">
                          Please select a valid country.
                        </div>
                      </div>

                      <div className="col-md-4 my-1">
                        <label for="state" className="form-label">
                          State
                        </label>
                        <br />
                        <select className="form-select" id="state"

                          required>
                          <option value="">Choose...</option>
                          <option>California</option>
                          <option>Kentucky</option>
                          <option>Ohio</option>
                          <option>Texas</option>
                        </select>
                        <div className="invalid-feedback">
                          Please provide a valid state.
                        </div>
                      </div>

                      <div className="col-md-3 my-1">
                        <label for="zip" className="form-label">
                          Zip
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="zip"
                          placeholder=""

                          required
                        />
                        <div className="invalid-feedback">
                          Zip code required.
                        </div>
                      </div>
                    </div>

                    <hr className="my-4" />

                    <h4 className="mb-3">Payment</h4>

                    <div className="row gy-3">
                      <div className="col-md-6">
                        <label for="cc-name" className="form-label">
                          Name on card
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="cc-name"
                          placeholder=""
                          required
                        />
                        <small className="text-muted">
                          Full name as displayed on card
                        </small>
                        <div className="invalid-feedback">
                          Name on card is required
                        </div>
                      </div>

                      <div className="col-md-6">
                        <label for="cc-number" className="form-label">
                          Credit card number
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="cc-number"
                          placeholder=""
                          required
                        />
                        <div className="invalid-feedback">
                          Credit card number is required
                        </div>
                      </div>

                      <div className="col-md-3">
                        <label for="cc-expiration" className="form-label">
                          Expiration
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="cc-expiration"
                          placeholder=""
                          required
                        />
                        <div className="invalid-feedback">
                          Expiration date required
                        </div>
                      </div>

                      <div className="col-md-3">
                        <label for="cc-cvv" className="form-label">
                          CVV
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="cc-cvv"
                          placeholder=""
                          required
                        />
                        <div className="invalid-feedback">
                          Security code required
                        </div>
                      </div>
                    </div>

                    <hr className="my-4" />

                    <button
                      className="w-100 btn btn-primary "
                      type="submit"
                    >
                      Continue to checkout
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };
  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        {orderPlaced ? <OrderSuccess /> : (state.length === 0 ? <EmptyCart /> : <ShowCheckout />)}
      </div>
      <Footer />
    </>
  );
};

export default Checkout;
