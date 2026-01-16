#!/bin/bash

echo $BRANCH_NAME
echo $TESTIM_PROJECT_ID
echo $TESTIM_GRID_NAME

if [ "$BRANCH_NAME" = "staging" ]
then
    # CI staging runs tests on dev env
    echo $BEAUTYTECH_GENERIC_USER | sed "s|email|username|g" | sed "s/\\\//g" > generic_credentials.json
    npm i -g @testim/testim-cli && testim --base-url https://betiq-dv.beauty.tech/ --branch master --token $TESTIM_ACCESS_TOKEN --project $TESTIM_PROJECT_ID --grid $TESTIM_GRID_NAME --params-file "generic_credentials.json" --retries 1 | exit 0
elif [ "$BRANCH_NAME" = "master" ]
then
    # CI master runs tests on qa env
    echo $BEAUTYTECH_GENERIC_USER | sed "s|email|username|g" | sed "s/\\\//g" > generic_credentials.json
    npm i -g @testim/testim-cli && testim --label "qa" --base-url https://betiq-qa.beauty.tech/ --branch master --token $TESTIM_ACCESS_TOKEN --project $TESTIM_PROJECT_ID --grid $TESTIM_GRID_NAME --params-file "generic_credentials.json" --retries 1 | exit 0
else
    echo "No configuration to run testim for $BRANCH_NAME"
fi