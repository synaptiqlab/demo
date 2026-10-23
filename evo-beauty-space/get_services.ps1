try {
    $headers = @{
        'User-Agent' = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        'Accept' = 'application/json, text/plain, */*'
    }
    # Check Altegio public widget api for company 251848
    $url = "https://api.alteg.io/api/v1/book_services/251848"
    $response = Invoke-RestMethod -Uri $url -Headers $headers -Method Get -TimeoutSec 15
    $services = $response.services
    if (-not $services) {
        $services = $response.data.services
    }
    if (-not $services) {
        $services = $response.data
    }
    Write-Output "COUNT: $($services.Count)"
    $services | Select-Object -First 20 | ForEach-Object {
        Write-Output "$($_.id) | $($_.title) | $($_.price_min)"
    }
} catch {
    Write-Output "ERROR: $($_.Exception.Message)"
}
