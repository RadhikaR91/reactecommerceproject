import { CognitoUserPool } from 'amazon-cognito-identity-js';

const poolData = {
    UserPoolId: 'us-east-1_3GgsZhD4Q',
    ClientId: '1ampoq9ohbl4lseuriugup8ckl'
};

export default new CognitoUserPool(poolData);