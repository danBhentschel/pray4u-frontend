const config = {
    // Backend config
    s3: {
        REGION: 'us-east-1',
        BUCKET: 'pray4u-backend-dev-textbucket-8z2y9xqgy1q8',
    },
    apiGateway: {
        REGION: 'us-east-1',
        URL: 'https://qobueyluhc.execute-api.us-east-1.amazonaws.com/dev',
    },
    cognito: {
        REGION: 'us-east-1',
        USER_POOL_ID: 'us-east-1_HqMx1CWjI',
        APP_CLIENT_ID: '68fsrett0s6oqkjin5lspp37p9',
        IDENTITY_POOL_ID: 'us-east-1:af8eef97-4227-4648-aecf-393570cf0ae0',
    },
};

export default config;
