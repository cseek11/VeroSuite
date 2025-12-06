$p = Start-Process -FilePath cmd.exe -ArgumentList '/c','cd /d C:\Users\ashse\Documents\VeroField\Training\VeroField && node apps\api\dist\apps\api\src\main.js' -RedirectStandardOutput 'C:\Users\ashse\Documents\VeroField\Training\VeroField\docs\migration\nest-start.log' -RedirectStandardError 'C:\Users\ashse\Documents\VeroField\Training\VeroField\docs\migration\nest-start.err' -PassThru
Start-Sleep -Seconds 40
Stop-Process -Id $p.Id
