param($outputPath, $scannerIndex = 1, $mode = "single")

# Resolución del código de error a partir del HResult numérico (fiable, independiente del idioma de Windows)
function Resolve-WiaErrorCode($exception) {
    $hresult = $exception.HResult
    $hresultHex = "0x{0:X8}" -f $hresult

    switch ($hresultHex) {
        "0x80210002" { return "PAPER_JAM" }        # Atasco de papel real
        "0x80210003" { return "NO_PAPER" }         # Sin papel / alimentador vacío
        "0x80210005" { return "DEVICE_OFFLINE" }
        "0x80210006" { return "BUSY" }
        "0x80210015" { return "NOT_FOUND" }
    }

    # Fallback de texto multi-idioma (por si el HResult conocido no coincide)
    $errorMsg = $exception.Message
    if ($errorMsg -match "offline") { return "DEVICE_OFFLINE" }
    if ($errorMsg -match "busy|occup") { return "BUSY" }
    if ($errorMsg -match "no scanners found") { return "NOT_FOUND" }
    if ($errorMsg -match "plus de documents|no.*paper|paper.*empty|feeder.*empty") { return "NO_PAPER" }
    if ($errorMsg -match "jam|coinc|atasco") { return "PAPER_JAM" }

    return "UNKNOWN"
}

try {
    $deviceManager = New-Object -ComObject WIA.DeviceManager
    $scannerInfo = $deviceManager.DeviceInfos.Item([int]$scannerIndex)

    if (-not $scannerInfo) {
        Write-Output "ERROR:NOT_FOUND"
        exit 1
    }

    $device = $scannerInfo.Connect()

    if ($mode -eq "multi") {
        foreach ($prop in $device.Properties) {
            if ($prop.PropertyID -eq 3088) { $prop.Value = 1 }   # FEEDER (ADF)
        }

        $feedReady = $false
        foreach ($prop in $device.Properties) {
            if ($prop.PropertyID -eq 3087) {
                if (($prop.Value -band 1) -eq 1) { $feedReady = $true }
            }
        }

        if (-not $feedReady) {
            Write-Output "ERROR:NO_PAPER"
            exit 1
        }

        $item = $device.Items.Item(1)
        $index = 1
        $hasMore = $true
        $any = $false

        while ($hasMore) {
            try {
                $image = $item.Transfer()
                $pagePath = $outputPath -replace "\.jpg$", "_page$index.jpg"
                $image.SaveFile($pagePath)
                Write-Output "PAGE:$pagePath"
                [Console]::Out.Flush()
                $any = $true
                $index++
                if ($index -gt 200) { $hasMore = $false }
            }
            catch {
                $code = Resolve-WiaErrorCode $_.Exception

                if ($code -eq "NO_PAPER") {
                    # Fin normal del ADF: el alimentador está vacío, es lo esperado
                    $hasMore = $false
                }
                else {
                    # Error real durante el escaneo (atasco, offline, ocupado, desconocido)
                    $hasMore = $false
                    if ($code -eq "UNKNOWN") { Write-Error $_.Exception.Message }
                    Write-Output "ERROR:$code"
                    [Console]::Out.Flush()
                    exit 1
                }
            }
        }

        if (-not $any) {
            Write-Output "ERROR:NO_PAPER"
            exit 1
        }

        Write-Output "DONE"
        [Console]::Out.Flush()
    }
    else {
        # Modo single: se fuerza FLATBED para evitar heredar un estado FEEDER residual
        foreach ($prop in $device.Properties) {
            if ($prop.PropertyID -eq 3088) { $prop.Value = 2 }   # FLATBED
        }

        $item = $device.Items.Item(1)
        $image = $item.Transfer()
        $image.SaveFile($outputPath)
        Write-Output "OK"
    }
}
catch {
    $code = Resolve-WiaErrorCode $_.Exception
    if ($code -eq "UNKNOWN") { Write-Error $_.Exception.Message }
    Write-Output "ERROR:$code"
    exit 1
}