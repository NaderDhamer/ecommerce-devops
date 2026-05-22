$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$terraformDir = Join-Path $repoRoot "terraform"
$ansibleDir = Join-Path $repoRoot "ansible"
$inventoryPath = Join-Path $ansibleDir "inventory.generated.ini"

$keyPath = $env:ANSIBLE_SSH_PRIVATE_KEY_FILE
if (-not $keyPath) {
    $keyPath = "/home/nader/.ssh/devops-lab-key.pem"
}

$terraform = Get-Command terraform -ErrorAction SilentlyContinue
if (-not $terraform) {
    throw "terraform is not installed or not available in PATH"
}

$ansible = Get-Command ansible-playbook -ErrorAction SilentlyContinue
if (-not $ansible) {
    throw "ansible-playbook is not installed or not available in PATH"
}

Push-Location $terraformDir
try {
    terraform init
    terraform apply -auto-approve
    $publicIp = terraform output -raw public_ip
}
finally {
    Pop-Location
}

@"
[web]
$publicIp ansible_user=ec2-user ansible_ssh_private_key_file=$keyPath
"@ | Set-Content -Path $inventoryPath

try {
    ansible-playbook (Join-Path $ansibleDir "deploy.yml") -i $inventoryPath
}
finally {
    Remove-Item $inventoryPath -ErrorAction SilentlyContinue
}
