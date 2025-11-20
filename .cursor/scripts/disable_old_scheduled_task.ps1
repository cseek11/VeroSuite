# PowerShell script to disable the old scheduled task
# This prevents conflicts with the new automatic system

$taskName = "VeroField_AutoPR_Daemon"

Write-Host "Checking for old scheduled task: $taskName" -ForegroundColor Yellow

try {
    $task = Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue
    
    if ($task) {
        Write-Host "Found scheduled task: $taskName" -ForegroundColor Yellow
        Write-Host "  State: $($task.State)" -ForegroundColor Gray
        
        # Disable the task
        Disable-ScheduledTask -TaskName $taskName -ErrorAction Stop
        Write-Host "✅ Disabled scheduled task: $taskName" -ForegroundColor Green
        
        # Optionally remove it (uncomment if you want to delete it completely)
        # Unregister-ScheduledTask -TaskName $taskName -Confirm:$false
        # Write-Host "✅ Removed scheduled task: $taskName" -ForegroundColor Green
    } else {
        Write-Host "✅ No old scheduled task found" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Error managing scheduled task: $_" -ForegroundColor Red
    exit 1
}

Write-Host "`nOld scheduled task has been disabled." -ForegroundColor Green
Write-Host "The new automatic system will handle session management." -ForegroundColor Gray







