#!/bin/bash

echo $_BASE_BRANCH
echo $TESTIM_PROJECT_ID
echo $TESTIM_GRID_NAME

if [[ "$_BASE_BRANCH" =~ ^"rc/" ]]
then
    # CI staging runs tests on dev env
    echo \{ > generic_credentials.json
    echo \"user1\": $BEAUTYTECH_GENERIC_USER, | sed "s|email|username|g" | sed "s/\\\//g" >> generic_credentials.json
    echo \"user2\": $BEAUTYTECH_GENERIC_USER_2, | sed "s|email|username|g" | sed "s/\\\//g" >> generic_credentials.json
    echo \"user3\": $BEAUTYTECH_GENERIC_USER_3 | sed "s|email|username|g" | sed "s/\\\//g" >> generic_credentials.json
    echo \} >> generic_credentials.json
    npm i -g @testim/testim-cli && testim --label "version2" --base-url https://project-template-dev.beauty.tech/ --branch master --token $TESTIM_ACCESS_TOKEN --project $TESTIM_PROJECT_ID --grid $TESTIM_GRID_NAME --params-file "generic_credentials.json" || exit 0
elif [[ "$_BASE_BRANCH" = "master" ]]
then
    # CI master runs tests on qa env
    echo \{ > generic_credentials.json
    echo \"user1\": $BEAUTYTECH_GENERIC_USER, | sed "s|email|username|g" | sed "s/\\\//g" >> generic_credentials.json
    echo \"user2\": $BEAUTYTECH_GENERIC_USER_2, | sed "s|email|username|g" | sed "s/\\\//g" >> generic_credentials.json
    echo \"user3\": $BEAUTYTECH_GENERIC_USER_3 | sed "s|email|username|g" | sed "s/\\\//g" >> generic_credentials.json
    echo \} >> generic_credentials.json
    npm i -g @testim/testim-cli && testim --label "version2" --label "qa" --base-url https://project-template-qa.beauty.tech/ --branch master --token $TESTIM_ACCESS_TOKEN --project $TESTIM_PROJECT_ID --grid $TESTIM_GRID_NAME --params-file "generic_credentials.json" || exit 0
else
    echo "No configuration to run testim for $BRANCH_NAME"
fi
