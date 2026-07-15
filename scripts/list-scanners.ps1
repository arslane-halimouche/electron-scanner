try {
    $deviceManager = New-Object -ComObject WIA.DeviceManager

    $result = @()
    $i = 0

    foreach ($s in $deviceManager.DeviceInfos) {
        $i++

        $name = ""
        try { $name = $s.Properties("Name").Value } catch { $name = "Escáner desconocido" }

        $port = ""
        try { $port = $s.Properties("Port").Value } catch { $port = "" }

        $deviceType = 0
        try { $deviceType = $s.Type } catch { $deviceType = 0 }

        # Excluir cámaras (Type 2) y vídeo (Type 3)
        if ($deviceType -ne 2 -and $deviceType -ne 3) {
            $result += [PSCustomObject]@{
                index = $i
                name  = $name
                port  = $port
            }
        }
    }

    if ($result.Count -eq 0) {
        Write-Output "[]"
        exit 0
    }

    if ($result.Count -eq 1) {
        Write-Output "[$($result[0] | ConvertTo-Json -Compress)]"
    } else {
        Write-Output ($result | ConvertTo-Json -Compress)
 
    }
}
catch {
    Write-Output "[]"
    exit 1
}