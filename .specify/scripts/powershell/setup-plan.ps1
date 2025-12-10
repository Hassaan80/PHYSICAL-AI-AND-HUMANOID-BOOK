param (
    [switch]$Json
)

# Get current branch name
$currentBranch = (git rev-parse --abbrev-ref HEAD)

# Extract Number and ShortName from branch name
if ($currentBranch -match "^(\d+)-(.+)$") {
    $number = $matches[1]
    $shortName = $matches[2]
} else {
    Write-Host "Error: Not on a feature branch (e.g., 1-my-feature)." -ForegroundColor Red
    exit 1
}

$specsDir = "specs/$number-$shortName"
$featureSpec = "$specsDir/spec.md"
$implPlan = "$specsDir/plan.md"

# Copy the plan template if it doesn't exist already
$planTemplateSource = ".specify/templates/plan-template.md" # Assuming this path
if (-not (Test-Path $planTemplateSource)) {
    Write-Host "Error: Plan template not found at '$planTemplateSource'." -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $implPlan)) {
    try {
        Copy-Item -Path $planTemplateSource -Destination $implPlan -Force | Out-Null
    } catch {
        Write-Host "Error copying plan template to '$implPlan'. Details: $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }
}

$output = @{
    FEATURE_SPEC = $featureSpec;
    IMPL_PLAN = $implPlan;
    SPECS_DIR = $specsDir;
    BRANCH = $currentBranch
}

if ($Json) {
    $output | ConvertTo-Json -Depth 100
} else {
    Write-Host "FEATURE_SPEC: $featureSpec"
    Write-Host "IMPL_PLAN: $implPlan"
    Write-Host "SPECS_DIR: $specsDir"
    Write-Host "BRANCH: $currentBranch"
}
