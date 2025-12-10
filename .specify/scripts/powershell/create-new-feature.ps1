param (
    [switch]$Json,
    [int]$Number,
    [string]$ShortName,
    [string]$FeatureDescriptionPath
)

# Define paths
$featureDirName = "$Number-$ShortName"
$featureDirPath = "specs/$featureDirName"
$specFilePath = "$featureDirPath/spec.md"
$branchName = "$Number-$ShortName"

# 1. Create a new git branch
try {
    git checkout -b $branchName
} catch {
    Write-Host "Error creating or checking out branch '$branchName'. Details: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 2. Create feature directory
try {
    New-Item -ItemType Directory -Path $featureDirPath -Force | Out-Null
} catch {
    Write-Host "Error creating feature directory '$featureDirPath'. Details: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 3. Create spec.md file
try {
    New-Item -ItemType File -Path $specFilePath -Force | Out-Null
} catch {
    Write-Host "Error creating spec file '$specFilePath'. Details: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Output results
$output = @{
    BRANCH_NAME = $branchName;
    SPEC_FILE = $specFilePath;
    FEATURE_DESCRIPTION = [string](Get-Content -Raw $FeatureDescriptionPath) # Store the description for later use if needed
}

if ($Json) {
    $output | ConvertTo-Json -Depth 100
} else {
    Write-Host "BRANCH_NAME: $branchName"
    Write-Host "SPEC_FILE: $specFilePath"
}