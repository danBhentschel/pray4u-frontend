const config = {
    s3: {
        REGION: 'us-east-1',
        BUCKET: 'pray4u-backend-cypress-textbucket-h12cuvik1qzy',
    },
    apiGateway: {
        REGION: 'us-east-1',
        URL: 'https://api.dev.pray4u.org/cypress',
    },
    cognito: {
        REGION: 'us-east-1',
        USER_POOL_ID: 'us-east-1_flNREombi',
        APP_CLIENT_ID: '3dp29q2avd9s88dh9fh8kd87pg',
        IDENTITY_POOL_ID: 'us-east-1:0c1e697e-8a21-4f29-a794-53974f167280',
    },
};

export default config;
