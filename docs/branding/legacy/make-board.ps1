Add-Type -AssemblyName System.Drawing

$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$assets = Join-Path $here "assets"
$fonts = Join-Path $here "../../packages/engine/assets/fonts"
$icon = Join-Path $assets "aulacbot-mark-1024.png"
$icon16 = Join-Path $assets "aulacbot-mark-16.png"
$icon32 = Join-Path $assets "aulacbot-mark-32.png"
$icon48 = Join-Path $assets "aulacbot-mark-48.png"
$icon64 = Join-Path $assets "aulacbot-mark-64.png"
$icon128 = Join-Path $assets "aulacbot-mark-128.png"

$pfc = New-Object System.Drawing.Text.PrivateFontCollection
$pfc.AddFontFile((Join-Path $fonts "Onest-Bold.ttf"))
$pfc.AddFontFile((Join-Path $fonts "Onest-Regular.ttf"))
$family = $pfc.Families[0]

$jade = [System.Drawing.ColorTranslator]::FromHtml("#08251C")
$jade2 = [System.Drawing.ColorTranslator]::FromHtml("#0B3226")
$gold = [System.Drawing.ColorTranslator]::FromHtml("#E6B04A")
$gold2 = [System.Drawing.ColorTranslator]::FromHtml("#F2C96B")
$cream = [System.Drawing.ColorTranslator]::FromHtml("#FAE9BF")
$bronze = [System.Drawing.ColorTranslator]::FromHtml("#8F5C2C")
$paper = [System.Drawing.ColorTranslator]::FromHtml("#F5EEDC")
$ink = [System.Drawing.ColorTranslator]::FromHtml("#10251D")
$muted = [System.Drawing.ColorTranslator]::FromHtml("#5B6C63")
$line = [System.Drawing.ColorTranslator]::FromHtml("#D8CDB4")

function Font($size, $bold) {
  $style = if ($bold) { [System.Drawing.FontStyle]::Bold } else { [System.Drawing.FontStyle]::Regular }
  return [System.Drawing.Font]::new($family, [float]$size, $style, [System.Drawing.GraphicsUnit]::Pixel)
}

function Brush($color) {
  return [System.Drawing.SolidBrush]::new([System.Drawing.Color]$color)
}

function New-Graphics($width, $height, $transparent) {
  $bmp = [System.Drawing.Bitmap]::new([int]$width, [int]$height)
  $bmp.SetResolution(96, 96)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAlias
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
  if ($transparent) { $g.Clear([System.Drawing.Color]::Transparent) }
  return @{ Bitmap = $bmp; Graphics = $g }
}

function Round-Path($x, $y, $w, $h, $r) {
  $path = [System.Drawing.Drawing2D.GraphicsPath]::new()
  $d = [float]($r * 2)
  $path.AddArc([float]$x, [float]$y, $d, $d, 180, 90)
  $path.AddArc([float]($x + $w - $d), [float]$y, $d, $d, 270, 90)
  $path.AddArc([float]($x + $w - $d), [float]($y + $h - $d), $d, $d, 0, 90)
  $path.AddArc([float]$x, [float]($y + $h - $d), $d, $d, 90, 90)
  $path.CloseFigure()
  return $path
}

function Rounded-Rect($g, $color, $x, $y, $w, $h, $r) {
  $path = Round-Path $x $y $w $h $r
  $brush = Brush $color
  $g.FillPath($brush, $path)
  $brush.Dispose()
  $path.Dispose()
}

function Text-Width($g, $text, $font, $track) {
  $sf = [System.Drawing.StringFormat]::GenericTypographic
  $w = 0.0
  foreach ($ch in $text.ToCharArray()) {
    $w += $g.MeasureString([string]$ch, $font, [System.Drawing.PointF]::new(0, 0), $sf).Width + $track
  }
  $sf.Dispose()
  return [Math]::Max(0, $w - $track)
}

function Tracked-Text($g, $text, $font, $color, $x, $y, $track, $center) {
  $sf = [System.Drawing.StringFormat]::GenericTypographic
  $brush = Brush $color
  $w = Text-Width $g $text $font $track
  $cx = if ($center) { $x - $w / 2 } else { $x }
  foreach ($ch in $text.ToCharArray()) {
    $g.DrawString([string]$ch, $font, $brush, [float]$cx, [float]$y, $sf)
    $cx += $g.MeasureString([string]$ch, $font, [System.Drawing.PointF]::new(0, 0), $sf).Width + $track
  }
  $brush.Dispose()
  $sf.Dispose()
  return $w
}

function Centered-Text($g, $text, $font, $color, $cx, $y) {
  $sf = [System.Drawing.StringFormat]::GenericTypographic
  $width = $g.MeasureString($text, $font, [System.Drawing.PointF]::new(0, 0), $sf).Width
  $brush = Brush $color
  $g.DrawString($text, $font, $brush, [float]($cx - $width / 2), [float]$y, $sf)
  $brush.Dispose()
  $sf.Dispose()
}

function Draw-Icon($g, $file, $x, $y, $size) {
  $img = [System.Drawing.Image]::FromFile($file)
  $g.DrawImage($img, [float]$x, [float]$y, [float]$size, [float]$size)
  $img.Dispose()
}

function Save-Png($bmp, $g, $path) {
  $g.Dispose()
  $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
}

# --- Brand board -----------------------------------------------------------------
$b = New-Graphics 1600 1000 $false
$g = $b.Graphics
$g.Clear($paper)

Rounded-Rect $g $jade 60 60 700 880 48
$pen = [System.Drawing.Pen]::new($jade2, 2)
$g.DrawEllipse($pen, 220, 126, 400, 400)
$pen.Dispose()
Draw-Icon $g $icon 238 162 352

$w = Tracked-Text $g "AULACBOT" (Font 52 $true) $cream 410 572 5 $true
Tracked-Text $g "ÂU LẠC BOT" (Font 18 $false) $gold 410 632 6 $true | Out-Null

$p = [System.Drawing.Pen]::new($bronze, 1)
$g.DrawLine($p, 330, 678, 490, 678)
$p.Dispose()

$sf = [System.Drawing.StringFormat]::GenericTypographic
$f = Font 17 $false
Centered-Text $g "Trợ lý AI cá nhân" $f "#B9C7BE" 410 700
Centered-Text $g "Không gian AI cho nhóm" $f "#B9C7BE" 410 728
$f.Dispose()

Tracked-Text $g "AULAC.APP" (Font 20 $true) $gold 410 812 4 $true | Out-Null

Tracked-Text $g "BRAND MARK / 01" (Font 12 $true) $bronze 830 100 2 $false | Out-Null
$f = Font 54 $true
$br = Brush $jade
$g.DrawString("Chim Lạc", $f, $br, 830, 126, $sf)
$br.Dispose()
$f.Dispose()

Tracked-Text $g "A · LẠC" (Font 14 $true) $bronze 832 202 4 $false | Out-Null

$f = Font 19 $false
$br = Brush $ink
$g.DrawString("Thân chim là nét A: hai chân mở, cánh vươn", $f, $br, 830, 252, $sf)
$g.DrawString("thành thanh ngang. Đọc được ở 16 px, vẫn có hồn", $f, $br, 830, 280, $sf)
$g.DrawString("ở 1024 px. Không dùng lại logo của agentes.chat.", $f, $br, 830, 308, $sf)
$br.Dispose()
$f.Dispose()

Tracked-Text $g "PALETTE" (Font 12 $true) $muted 830 386 2 $false | Out-Null
$sw = @(
  @{ Name = "JADE"; Hex = "#08251C"; Color = $jade },
  @{ Name = "GOLD"; Hex = "#E6B04A"; Color = $gold },
  @{ Name = "CREAM"; Hex = "#FAE9BF"; Color = $cream },
  @{ Name = "BRONZE"; Hex = "#8F5C2C"; Color = $bronze }
)
$sx = 830
for ($i = 0; $i -lt 4; $i++) {
  $s = $sw[$i]
  Rounded-Rect $g $s.Color $sx 420 154 96 10
  $f = Font 11 $true
  $br = Brush $muted
  $g.DrawString($s.Name, $f, $br, $sx, 528, $sf)
  $g.DrawString($s.Hex, $f, $br, $sx, 546, $sf)
  $br.Dispose()
  $f.Dispose()
  $sx += 172
}

Tracked-Text $g "SIZES" (Font 12 $true) $muted 830 618 2 $false | Out-Null
$p = [System.Drawing.Pen]::new($line, 1)
$g.DrawLine($p, 830, 642, 1530, 642)
$p.Dispose()

$sizes = @(16, 32, 48, 64, 128)
$files = @($icon16, $icon32, $icon48, $icon64, $icon128)
$x = 830
for ($i = 0; $i -lt $sizes.Count; $i++) {
  $n = $sizes[$i]
  $y = 738 - $n
  Draw-Icon $g $files[$i] $x $y $n
  $f = Font 11 $true
  $br = Brush $muted
  $g.DrawString("$n", $f, $br, ($x + $n / 2 - 8), 750, $sf)
  $br.Dispose()
  $f.Dispose()
  $x += $n + 56
}

$f = Font 13 $false
$br = Brush $muted
$g.DrawString("AULACBOT / AULAC.APP / 2026", $f, $br, 60, 958, $sf)
$g.DrawString("Original fork identity - upstream attribution stays visible", $f, $br, 890, 958, $sf)
$br.Dispose()
$f.Dispose()
$sf.Dispose()

Save-Png $b.Bitmap $g (Join-Path $assets "aulacbot-brand-board.png")

# --- Social card -----------------------------------------------------------------
$b = New-Graphics 1200 630 $false
$g = $b.Graphics
$g.Clear($jade)

$pen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(255, 18, 60, 48), 56)
$g.DrawEllipse($pen, 72, 35, 560, 560)
$pen.Dispose()
$pen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(255, 18, 60, 48), 2)
$g.DrawEllipse($pen, 130, 93, 444, 444)
$pen.Dispose()

Draw-Icon $g $icon 88 154 300
$sf = [System.Drawing.StringFormat]::GenericTypographic

Tracked-Text $g "AULACBOT" (Font 86 $true) $cream 456 160 6 $false | Out-Null
Tracked-Text $g "ÂU LẠC BOT" (Font 25 $false) $gold 458 278 7 $false | Out-Null

$f = Font 22 $false
$br = Brush "#C7D5CC"
$g.DrawString("Trợ lý AI cá nhân", $f, $br, 458, 344, $sf)
$g.DrawString("Không gian AI cho nhóm", $f, $br, 458, 380, $sf)
$br.Dispose()
$f.Dispose()

$p = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(255, 183, 122, 54), 2)
$g.DrawLine($p, 458, 458, 924, 458)
$p.Dispose()
Tracked-Text $g "AULAC.APP" (Font 28 $true) $gold2 459 490 5 $false | Out-Null

$sf.Dispose()
Save-Png $b.Bitmap $g (Join-Path $assets "aulacbot-og-1200x630.png")

# --- Wordmarks and lockups -------------------------------------------------------
function Make-Wordmark($color, $file) {
  $b = New-Graphics 1600 260 $true
  $g = $b.Graphics
  $font = Font 160 $true
  $width = Text-Width $g "AULACBOT" $font 6
  Tracked-Text $g "AULACBOT" $font $color ((1600 - $width) / 2) 24 6 $false | Out-Null
  $sf = [System.Drawing.StringFormat]::GenericTypographic
  $sf.Dispose()
  $font.Dispose()
  Save-Png $b.Bitmap $g $file
}

Make-Wordmark $cream (Join-Path $assets "aulacbot-wordmark-cream.png")
Make-Wordmark $jade (Join-Path $assets "aulacbot-wordmark-jade.png")

function Make-Lockup($color, $sub, $file) {
  $b = New-Graphics 1900 520 $true
  $g = $b.Graphics
  Draw-Icon $g $icon 24 72 360
  $font = Font 132 $true
  Tracked-Text $g "AULACBOT" $font $color 450 123 5 $false | Out-Null
  $font.Dispose()
  $f = Font 30 $false
  $br = Brush $sub
  $sf = [System.Drawing.StringFormat]::GenericTypographic
  $g.DrawString("ÂU LẠC BOT  /  AULAC.APP", $f, $br, 458, 296, $sf)
  $br.Dispose()
  $f.Dispose()
  $sf.Dispose()
  Save-Png $b.Bitmap $g $file
}

Make-Lockup $cream $gold (Join-Path $assets "aulacbot-logo-dark.png")
Make-Lockup $jade $bronze (Join-Path $assets "aulacbot-logo-light.png")

Write-Output "Brand board, social card and lockups written to $assets"
