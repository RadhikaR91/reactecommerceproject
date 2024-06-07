import React, { useState } from 'react'
import { Footer, Navbar } from "../components";
import { Link, useNavigate } from 'react-router-dom';
import { signUp, verifyEmail } from '../services/authService';


const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [code, setCode] = useState('');
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [isRegistered, setIsRegistered] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!isRegistered) {
            try {
                await signUp(name, email, password);
                setMessage('Registration successful! Please check your email for the verification code.');
                setIsRegistered(true);
            } catch (error) {
                setError(error.message);
            }
        } else {
            try {
                await verifyEmail(email, code);
                setMessage('Email verified successfully! You can now log in.');
                setTimeout(() => navigate('/login'), 3000); // Redirect to login after 3 seconds
            } catch (error) {
                setError(error.message);
            }
        }
    };

    return (
        <>
            <Navbar />
            <div className="container my-3 py-3">
                <h1 className="text-center">{isRegistered ? 'Verify Email' : 'Register'}</h1>
                <hr />
                <div class="row my-4 h-100">
                    <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
                        <form onSubmit={handleSubmit}>
                            {!isRegistered ? (
                                <>
                                    <div class="form my-3">
                                        <label for="Name">Full Name</label>
                                        <input
                                            type="text"
                                            class="form-control"
                                            id="Name"
                                            placeholder="Enter Your Name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>
                                    <div class="form my-3">
                                        <label for="Email">Email address</label>
                                        <input
                                            type="email"
                                            class="form-control"
                                            id="Email"
                                            placeholder="name@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                    <div class="form  my-3">
                                        <label for="Password">Password</label>
                                        <input
                                            type="password"
                                            class="form-control"
                                            id="Password"
                                            placeholder="Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                </>
                            ) : (
                                <div className="form my-3">
                                    <label htmlFor="Code">Verification Code</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="Code"
                                        placeholder="Enter verification code"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                    />
                                </div>
                            )}
                            {error && <div className="alert alert-danger">{error}</div>}
                            {message && <div className="alert alert-success">{message}</div>}
                            <div className="my-3">
                                <p>Already has an account? <Link to="/login" className="text-decoration-underline text-info">Login</Link> </p>
                            </div>
                            <div className="text-center">
                                <button class="my-2 mx-auto btn btn-dark" type="submit">
                                    {isRegistered ? 'Verify Email' : 'Register'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Register