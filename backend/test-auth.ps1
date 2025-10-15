# Test Authentication Endpoints

Write-Host "=== Testing EasyCraft Auth Endpoints ===" -ForegroundColor Cyan

# 1. Health Check
Write-Host "`n1. Health Check..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:3001/api/health" -Method Get
    Write-Host "✓ Health: $($health.status)" -ForegroundColor Green
} catch {
    Write-Host "✗ Health check failed" -ForegroundColor Red
    exit 1
}

# 2. Register
Write-Host "`n2. Register User..." -ForegroundColor Yellow
$registerBody = @{
    email = "testuser@easycraft.com"
    password = "Test123!"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/register" -Method Post -ContentType "application/json" -Body $registerBody
    Write-Host "✓ User registered: $($registerResponse.data.user.email)" -ForegroundColor Green
    Write-Host "  Access Token: $($registerResponse.data.tokens.accessToken.Substring(0,20))..." -ForegroundColor Gray
} catch {
    Write-Host "✗ Register failed: $($_.Exception.Message)" -ForegroundColor Red
}

# 3. Login
Write-Host "`n3. Login..." -ForegroundColor Yellow
$loginBody = @{
    email = "testuser@easycraft.com"
    password = "Test123!"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/login" -Method Post -ContentType "application/json" -Body $loginBody
    Write-Host "✓ Login successful: $($loginResponse.data.user.email)" -ForegroundColor Green
    $accessToken = $loginResponse.data.tokens.accessToken
    $refreshToken = $loginResponse.data.tokens.refreshToken
    Write-Host "  Access Token: $($accessToken.Substring(0,20))..." -ForegroundColor Gray
    Write-Host "  Refresh Token: $($refreshToken.Substring(0,20))..." -ForegroundColor Gray
} catch {
    Write-Host "✗ Login failed: $($_.Exception.Message)" -ForegroundColor Red
}

# 4. Refresh Token
Write-Host "`n4. Refresh Token..." -ForegroundColor Yellow
$refreshBody = @{
    refreshToken = $refreshToken
} | ConvertTo-Json

try {
    $refreshResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/refresh" -Method Post -ContentType "application/json" -Body $refreshBody
    Write-Host "✓ Token refreshed" -ForegroundColor Green
    Write-Host "  New Access Token: $($refreshResponse.data.tokens.accessToken.Substring(0,20))..." -ForegroundColor Gray
} catch {
    Write-Host "✗ Refresh failed: $($_.Exception.Message)" -ForegroundColor Red
}

# 5. Logout
Write-Host "`n5. Logout..." -ForegroundColor Yellow
$headers = @{
    Authorization = "Bearer $accessToken"
}

try {
    $logoutResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/logout" -Method Post -Headers $headers
    Write-Host "✓ Logout successful" -ForegroundColor Green
} catch {
    Write-Host "✗ Logout failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== All Tests Completed ===" -ForegroundColor Cyan
