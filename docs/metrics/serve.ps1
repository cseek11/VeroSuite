# Simple HTTP Server for Dashboard
# Usage: .\serve.ps1

$port = 8000
$url = "http://localhost:$port/"

Write-Host "Starting HTTP server on $url" -ForegroundColor Green
Write-Host "Open http://localhost:$port/dashboard.html in your browser" -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host ""

# Check if port is available
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($url)
$listener.Start()

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $localPath = $request.Url.LocalPath
        if ($localPath -eq "/") { 
            $localPath = "/dashboard.html" 
        }
        
        $filePath = Join-Path $PWD $localPath.TrimStart('/')
        
        if (Test-Path $filePath -PathType Leaf) {
            $content = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentLength64 = $content.Length
            
            # Set content type based on extension
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentTypes = @{
                '.html' = 'text/html'
                '.js' = 'application/javascript'
                '.css' = 'text/css'
                '.json' = 'application/json'
                '.png' = 'image/png'
                '.jpg' = 'image/jpeg'
                '.svg' = 'image/svg+xml'
            }
            $response.ContentType = $contentTypes[$ext] ?? 'application/octet-stream'
            
            $response.StatusCode = 200
            $response.OutputStream.Write($content, 0, $content.Length)
            Write-Host "$($request.HttpMethod) $localPath - 200" -ForegroundColor Green
        } else {
            $response.StatusCode = 404
            $notFound = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $localPath")
            $response.ContentLength64 = $notFound.Length
            $response.ContentType = 'text/plain'
            $response.OutputStream.Write($notFound, 0, $notFound.Length)
            Write-Host "$($request.HttpMethod) $localPath - 404" -ForegroundColor Red
        }
        
        $response.Close()
    }
} finally {
    $listener.Stop()
    Write-Host "`nServer stopped." -ForegroundColor Yellow
}






