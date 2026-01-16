#!/bin/bash

echo $REPO_NAME
echo $BRANCH_NAME
echo $_BASE_BRANCH
echo $_PR_NUMBER
echo $COVERAGE_REPORT
echo $VERSION
echo $NEWCODE_BRANCH

if  [ "$_BASE_BRANCH" = "$NEWCODE_BRANCH" ]
then
    sonar-scanner -Dsonar.host.url=https://sonarcloud.io \
    -Dsonar.organization=loreal-techaccelerator \
    -Dsonar.projectKey=loreal-techaccelerator_$REPO_NAME \
    -Dsonar.sources=. $COVERAGE_REPORT \
    -Dsonar.pullrequest.branch=$BRANCH_NAME \
    -Dsonar.pullrequest.base=$_BASE_BRANCH \
    -Dsonar.pullrequest.key=$_PR_NUMBER \
    || echo "issue running sonar-scanner"
elif [ "$_BASE_BRANCH" = "staging" ]
then
    sonar-scanner -Dsonar.host.url=https://sonarcloud.io \
    -Dsonar.organization=loreal-techaccelerator \
    -Dsonar.projectKey=loreal-techaccelerator_$REPO_NAME \
    -Dsonar.sources=. $COVERAGE_REPORT \
    || echo "issue running sonar-scanner"
elif [ "$_BASE_BRANCH" = "master" ] ;
then
    sonar-scanner -Dsonar.host.url=https://sonarcloud.io \
    -Dsonar.organization=loreal-techaccelerator \
    -Dsonar.projectKey=loreal-techaccelerator_$REPO_NAME \
    -Dsonar.sources=. $COVERAGE_REPORT \
    || echo "issue running sonar-scanner"
elif [ "$BRANCH_NAME" = "$NEWCODE_BRANCH" ]
then
    sonar-scanner -Dsonar.host.url=https://sonarcloud.io \
    -Dsonar.organization=loreal-techaccelerator \
    -Dsonar.projectKey=loreal-techaccelerator_$REPO_NAME \
    -Dsonar.sources=. $COVERAGE_REPORT \
    -Dsonar.projectVersion=$VERSION \
    || echo "issue running sonar-scanner"
else
    echo "Unsatisfied conditions to run Sonar for \n _BASE_BRANCH $_BASE_BRANCH \n and BRANCH_NAME $BRANCH_NAME"
fi
