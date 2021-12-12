#!/usr/bin/env bash

region="us-east-1"
stackName="pray4u-backend-${SERVERLESS_STAGE}"
outputs=$(aws cloudformation describe-stacks --region $region --stack-name $stackName --query "Stacks[0].Outputs" --no-cli-pager)

extract_output() {
    key=$1
    echo $outputs | jq -r '(.[] | select(.OutputKey == "'$key'")).OutputValue'
}

textBucketName=$(extract_output textBucketName)
apiGatewayUrl="https://api.dev.pray4u.org/${SERVERLESS_STAGE}"
userPoolId=$(extract_output userPoolId)
userPoolClientId=$(extract_output userPoolClientId)
identityPoolId=$(extract_output identityPoolId)

cat <<EOF
const config = {
    s3: {
        REGION: '${region}',
        BUCKET: '${textBucketName}',
    },
    apiGateway: {
        REGION: '${region}',
        URL: '${apiGatewayUrl}',
    },
    cognito: {
        REGION: '${region}',
        USER_POOL_ID: '${userPoolId}',
        APP_CLIENT_ID: '${userPoolClientId}',
        IDENTITY_POOL_ID: '${identityPoolId}',
    },
};

export default config;
EOF
