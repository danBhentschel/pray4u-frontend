const config = {
    s3: {
        REGION: 'us-east-1',
        BUCKET: 'pray4u-backend-cypress-textbucket-zdke09iq8n8l',
    },
    apiGateway: {
        REGION: 'us-east-1',
        URL: 'https://api.dev.pray4u.org/cypress',
    },
    cognito: {
        REGION: 'us-east-1',
        USER_POOL_ID: 'us-east-1_9p83ZsmZ5',
        APP_CLIENT_ID: '17sd2semsh1m2fn2hmq09uc2u9',
        IDENTITY_POOL_ID: 'us-east-1:a2f08850-2ec5-4e62-b1bb-e01e4449f8a7',
    },
};

export default config;
