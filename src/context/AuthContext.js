import React, { createContext, useContext, useState, useEffect } from 'react';
import UserPool from '../aws-config';
import { signOut } from '../services/authService';
import { useDispatch } from "react-redux";
import { clearCart } from "../redux/action";
import {  useNavigate } from "react-router-dom";


const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userAttributes, setUserAttributes] = useState({});
    const dispatchcart = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const currentUser = UserPool.getCurrentUser();
        if (currentUser) {
            currentUser.getSession((err, session) => {
                if (err) {
                    console.log(err);
                } else {
                    setUser(currentUser);
                    currentUser.getUserAttributes((err, attributes) => {
                        if (err) {
                            console.log(err);
                        } else {
                            const attributesMap = {};
                            attributes.forEach(attr => {
                                attributesMap[attr.Name] = attr.Value;
                            });
                            setUserAttributes(attributesMap);
                        }
                    });
                }
            });
        }
    }, []);

    const login = (user, attributes) => {
        setUser(user);
        setUserAttributes(attributes);
    };

    const logout = () => {
        signOut();
        setUser(null);
        setUserAttributes({});
        dispatchcart(clearCart());
        navigate("/");
    };


    return (
        <AuthContext.Provider value={{ user, userAttributes, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
