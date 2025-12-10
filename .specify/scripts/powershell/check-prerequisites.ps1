param (
    [string]$FeatureDirectory,
    [switch]$Json,
    [switch]$RequireTasks,
    [switch]$IncludeTasks
)

$featureDir = $null

if (-not [string]::IsNullOrEmpty($FeatureDirectory)) {
    $featureDir = $FeatureDirectory
} else {
    # Get current branch name
    $currentBranch = (git rev-parse --abbrev-ref HEAD)

    # Extract Number and ShortName from branch name
    if ($currentBranch -match "^(\d+)-(.+)$") {
        $number = $matches[1]
        $shortName = $matches[2]
    } else {
        Write-Host "Error: Not on a feature branch (e.g., 1-my-feature) and no -FeatureDirectory specified." -ForegroundColor Red
        exit 1
    }
    $featureDir = "specs/$number-$shortName"
}

$availableDocs = @()

$requiredDocs = @(
    "$featureDir/plan.md",
    "$featureDir/spec.md"
)

$optionalDocs = @(
    "$featureDir/data-model.md",
    "$featureDir/contracts/README.md",
    "$featureDir/research.md",
    "$featureDir/quickstart.md"
)

foreach ($docPath in $requiredDocs) {
    if (-not (Test-Path $docPath)) {
        Write-Host "Error: Required document not found: $docPath" -ForegroundColor Red
        exit 1
    }
    $availableDocs += $docPath
}

foreach ($docPath in $optionalDocs) {
    if (Test-Path $docPath) {
        $availableDocs += $docPath
    }
}

$output = @{
    FEATURE_DIR = $featureDir;
    AVAILABLE_DOCS = $availableDocs
}

if ($Json) {
    $output | ConvertTo-Json -Depth 100
} else {
    Write-Host "FEATURE_DIR: $featureDir"
    Write-Host "AVAILABLE_DOCS: $($availableDocs -join ', ')"
}
