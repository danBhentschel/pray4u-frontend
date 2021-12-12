#!/usr/bin/env bash

set -e

export SERVERLESS_STAGE=$1
region="us-east-1"
stackName="pray4u-frontend-${SERVERLESS_STAGE}"

npx serverless deploy --stage $SERVERLESS_STAGE

outputs=$(aws cloudformation describe-stacks --region $region --stack-name $stackName --query "Stacks[0].Outputs" --no-cli-pager)

extract_output() {
    key=$1
    echo $outputs | jq -r '(.[] | select(.OutputKey == "'$key'")).OutputValue'
}

scripts/create_config.sh > src/config.ts

npx yarn build

siteBucketName=$(extract_output SiteBucketName)
siteUrl=$(extract_output SiteUrl)

echo "Deploying files to bucket $siteBucketName"
aws s3 sync build/ s3://$siteBucketName

echo
echo "Site uploaded to $siteUrl"
