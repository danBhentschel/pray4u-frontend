const config = {
    s3: {
        REGION: 'us-east-1',
        BUCKET: 'pray4u-backend-dev-textbucket-iekn0pcqt1l7',
    },
    apiGateway: {
        REGION: 'us-east-1',
        URL: 'https://api.dev.pray4u.org/dev',
    },
    cognito: {
        REGION: 'us-east-1',
        USER_POOL_ID: 'us-east-1_Js4fg6DMp',
        APP_CLIENT_ID: '2b6700e296kjtscnqojbvf6ijr',
        IDENTITY_POOL_ID: 'us-east-1:ad98566b-ef85-4b25-acf6-405a26aafbf2',
    },
};

export default config;
