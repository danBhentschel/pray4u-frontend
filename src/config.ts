const config = {
    s3: {
        REGION: 'us-east-1',
        BUCKET: 'pray4u-backend-dev-textbucket-11lrxxjz9p9e1',
    },
    apiGateway: {
        REGION: 'us-east-1',
        URL: 'https://api.dev.pray4u.org/dev',
    },
    cognito: {
        REGION: 'us-east-1',
        USER_POOL_ID: 'us-east-1_5n00OdDKT',
        APP_CLIENT_ID: '6pvlkfqgp1io61cdl9nm5ed9gt',
        IDENTITY_POOL_ID: 'us-east-1:7c069235-3a78-46e8-82cc-78a8c6683ffc',
    },
};

export default config;
