# Script to push Lambda function with required values
$tableName = "Post-kjn5z4i35rfghk3smjksxj23py-microblog"
$tableArn = "arn:aws:dynamodb:us-west-1:040479514298:table/Post-kjn5z4i35rfghk3smjksxj23py-microblog"

Write-Host "Pushing Lambda function with:"
Write-Host "Table Name: $tableName"
Write-Host "Table ARN: $tableArn"
Write-Host ""
Write-Host "When prompted, enter these values:"
Write-Host "POST_TABLE_NAME: $tableName"
Write-Host "POST_TABLE_ARN: $tableArn"
Write-Host ""

amplify push

