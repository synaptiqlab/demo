Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\79039\.gemini\antigravity\brain\0b5018df-e077-4f29-80af-9031032e16a3\.user_uploaded\media_1792004981878.png"
$dstPath = "C:\AntiG Project\VietSites\evo-beauty-space\assets\logo.png"

$orig = [System.Drawing.Bitmap]::FromFile($srcPath)
$width = $orig.Width
$height = $orig.Height

$transparentBmp = New-Object System.Drawing.Bitmap($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

# Bounding box coordinates
$minX = $width
$maxX = 0
$minY = $height
$maxY = 0

for ($y = 0; $y -lt $height; $y++) {
    for ($x = 0; $x -lt $width; $x++) {
        $c = $orig.GetPixel($x, $y)
        # If pure or near white background
        if ($c.R -gt 242 -and $c.G -gt 242 -and $c.B -gt 242) {
            $transparentBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        } elseif ($c.R -gt 225 -and $c.G -gt 225 -and $c.B -gt 225) {
            # Smooth anti-aliased edge
            $alpha = [int](255 * (1.0 - ($c.R - 225) / 20.0))
            if ($alpha -lt 0) { $alpha = 0 }
            if ($alpha -gt 255) { $alpha = 255 }
            $transparentBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $c.R, $c.G, $c.B))
            if ($alpha -gt 30) {
                if ($x -lt $minX) { $minX = $x }
                if ($x -gt $maxX) { $maxX = $x }
                if ($y -lt $minY) { $minY = $y }
                if ($y -gt $maxY) { $maxY = $y }
            }
        } else {
            $transparentBmp.SetPixel($x, $y, $c)
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

$orig.Dispose()

# Crop to tight bounding box with small 4px padding
$pad = 6
$cropX = [Math]::Max(0, $minX - $pad)
$cropY = [Math]::Max(0, $minY - $pad)
$cropW = [Math]::Min($width - $cropX, ($maxX - $minX) + ($pad * 2))
$cropH = [Math]::Min($height - $cropY, ($maxY - $minY) + ($pad * 2))

$cropRect = New-Object System.Drawing.Rectangle($cropX, $cropY, $cropW, $cropH)
$finalBmp = $transparentBmp.Clone($cropRect, $transparentBmp.PixelFormat)
$transparentBmp.Dispose()

$finalBmp.Save($dstPath, [System.Drawing.Imaging.ImageFormat]::Png)
$finalBmp.Dispose()

Write-Output "SUCCESS: Transparent cropped logo created ($cropW x $cropH) at $dstPath"
