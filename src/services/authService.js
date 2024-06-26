import { CognitoUser, AuthenticationDetails, CognitoUserAttribute } from 'amazon-cognito-identity-js';
import UserPool from '../aws-config';

export const signIn = (username, password) => {
    const user = new CognitoUser({
        Username: username,
        Pool: UserPool
    });

    const authDetails = new AuthenticationDetails({
        Username: username,
        Password: password
    });

    return new Promise((resolve, reject) => {
        user.authenticateUser(authDetails, {
            onSuccess: (data) => {
                console.log("Login success", data);
                const idToken = data.getIdToken().getJwtToken();
                user.getUserAttributes((err, attributes) => {
                    if (err) {
                        reject(err);
                    } else {
                        const userAttributes = {};
                        attributes.forEach(attr => {
                            userAttributes[attr.Name] = attr.Value;
                        });
                        resolve({ data, userAttributes, idToken });
                    }
                });
            },
            onFailure: (err) => {
                console.log("Login failed", err.message);
                reject(err);
            },
        });
    });
};

export const signUp = (name, email, password) => {
    const attributeList = [
        new CognitoUserAttribute({ Name: 'name', Value: name }),
        new CognitoUserAttribute({ Name: 'email', Value: email })
        // You can add more attributes here if needed
    ];

    return new Promise((resolve, reject) => {
        UserPool.signUp(email, password, attributeList, null, (err, result) => {
            if (err) {
                alert(err.message || JSON.stringify(err));
                reject(err);
                return;
            }
            console.log('user name is ', result.user);
            resolve(result.user);
        });
    });
};

export const verifyEmail = (email, code) => {
    return new Promise((resolve, reject) => {
        const userData = {
            Username: email,
            Pool: UserPool,
        };

        const cognitoUser = new CognitoUser(userData);

        cognitoUser.confirmRegistration(code, true, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

export const signOut = () => {
    const cognitoUser = UserPool.getCurrentUser();
    if (cognitoUser) {
        cognitoUser.signOut();
    }
};

export const getToken = () => {
    const cognitoUser = UserPool.getCurrentUser();
    if (!cognitoUser) {
        throw new Error('No user is currently logged in.');
    }

    return new Promise((resolve, reject) => {
        cognitoUser.getSession((err, session) => {
            if (err) {
                reject(err);
            } else {
                resolve(session.getIdToken().getJwtToken());
            }
        });
    });
}


