#!/usr/bin/env bash

set -e

export SERVERLESS_STAGE=$1
region="us-east-1"
stackName="pray4u-frontend-${SERVERLESS_STAGE}"

outputs=$(aws cloudformation describe-stacks --region $region --stack-name $stackName --query "Stacks[0].Outputs" --no-cli-pager)

extract_output() {
    key=$1
    echo $outputs | jq -r '(.[] | select(.OutputKey == "'$key'")).OutputValue'
}

siteBucketName=$(extract_output SiteBucketName)

echo "Removing all files from bucket $siteBucketName"
aws s3 rm s3://$siteBucketName --recursive

npx serverless remove --stage $SERVERLESS_STAGE

echo
echo "Site removed"
