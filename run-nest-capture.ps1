$p = Start-Process -FilePath cmd.exe -ArgumentList '/c','cd /d C:\Users\ashse\Documents\VeroField\Training\VeroField\apps\api && node dist\apps\api\src\main.js' -RedirectStandardOutput 'C:\Users\ashse\Documents\VeroField\Training\VeroField\docs\migration\nest-start-latest.log' -RedirectStandardError 'C:\Users\ashse\Documents\VeroField\Training\VeroField\docs\migration\nest-start-latest.err' -PassThru
Start-Sleep -Seconds 25
Stop-Process -Id $p.Id
