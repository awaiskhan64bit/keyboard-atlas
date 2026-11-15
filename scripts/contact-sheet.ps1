param([string]$Dir, [string]$Out, [int]$Cols = 5, [int]$W = 340, [int]$H = 230, [string]$Filter = '*')
Add-Type -AssemblyName System.Drawing
$files = Get-ChildItem (Join-Path $Dir $Filter) -File | Where-Object { $_.Extension -match 'jpe?g|png|webp' } | Sort-Object Name
$rows = [math]::Ceiling($files.Count / $Cols)
$bmp = New-Object System.Drawing.Bitmap ($Cols * $W), ($rows * $H)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.Clear([System.Drawing.Color]::White)
$font = New-Object System.Drawing.Font('Consolas', 11)
$brush = [System.Drawing.Brushes]::Black
$i = 0
foreach ($f in $files) {
  try {
    $img = [System.Drawing.Image]::FromFile($f.FullName)
    $x = ($i % $Cols) * $W
    $y = [math]::Floor($i / $Cols) * $H
    $scale = [math]::Min(($W - 8) / $img.Width, ($H - 26) / $img.Height)
    $w = [int]($img.Width * $scale); $h = [int]($img.Height * $scale)
    $g.DrawImage($img, $x + [int](($W - $w) / 2), $y + [int](($H - 22 - $h) / 2), $w, $h)
    $g.DrawString($f.Name, $font, $brush, $x + 4, $y + $H - 18)
    $img.Dispose()
  } catch { }
  $i++
}
$bmp.Save($Out, [System.Drawing.Imaging.ImageFormat]::Jpeg)
$g.Dispose(); $bmp.Dispose()
"$($files.Count) images -> $Out"
