# This script will create the Azure resources and deploy the Function Application and SPA Website

# Parameters - Change as you need. These override value in azuredeploy-parameters.json
$name = "fretboard3" # root name of the service
$location="uksouth" # location to create all the resources
$aadApiClientId="3a547b28-6e01-4970-a5c9-9eeb7faeb498" # The Client Id of Azure Active Directory App registration: fretboard_api

# Variables - leave these alone
$rg="rg-" + $name # Resource Group NAME
$storageAccountName="st" + $name # The storage account name to host the SPA website and application data
$functionAppName="fn-" + $name # The name of the function app

#Login to Azure if we need to (az login)
$context = Get-AzContext
if($context.Account -eq $null)
{
    Connect-AzAccount -UseDeviceAuthentication
}

#Create the Resource Group (az group create --location %loc% --name %rg%)
New-AzResourceGroup  -Name  $rg -Location $location -Force

#Deploy ARM Template (az deployment group create --resource-group=%rg% --template-file azuredeploy.json  --parameters @azuredeploy-parameters.json --parameters location=%location%)
New-AzResourceGroupDeployment -ResourceGroupName $rg -TemplateFile "azuredeploy.json" -location $location -functionAppName $functionAppName -storageAccountName $storageAccountName -aadApiClientId $aadApiClientId

#Create the static website endpoint on the storage account (az storage blob service-properties update --account-name %st% --static-website  --index-document index.html --404-document 404.html)
$storageAccount = Get-AzStorageAccount -ResourceGroupName $rg -AccountName $storageAccountName
Enable-AzStorageStaticWebsite -Context $storageAccount.Context -IndexDocument "index.html" -ErrorDocument404Path "404.html"

# NOW PUBLISH THE CODE

# Publish the Function .NET App
$functionPublishDir = "dotnetsrc\Fretboard\FretboardFunctions\bin\Release\netcoreapp3.1"
$deployZipFilePath = $functionPublishDir + "\deploy.zip"
Remove-Item ($functionPublishDir + "\*") -Recurse -Force   # Clear out publish directory 
dotnet publish "dotnetsrc\Fretboard\FretboardFunctions\FretboardFunctions.csproj" -o $functionPublishDir
Compress-Archive -Path ($functionPublishDir + "\*") -DestinationPath $deployZipFilePath #create zip for zip deploy
# Stop-AzWebApp -ResourceGroupName $rg -Name $functionAppName # stopping App Service as was getting errors "Deployment failed with status code NotFound". Update - on second thoughts this may be a transient error, keep an eye on it, not sure doing this helps.
Publish-AzWebApp -ResourceGroupName $rg -Name $functionAppName -ArchivePath (Resolve-Path $deployZipFilePath) -Force
# Start-AzWebApp -ResourceGroupName $rg -Name $functionAppName

#Publish the SPA
npm run build  #build SPA using Vue CLI
$containerSASUrl = New-AzStorageContainerSASToken -FullUri -Context $storageAccount.Context -ExpiryTime(get-date).AddSeconds(3600) -Name '$web' -Permission rw
$spaPublishPath = (Resolve-Path "dist").ToString() + "\*"
azcopy copy $spaPublishPath $containerSASUrl --recursive