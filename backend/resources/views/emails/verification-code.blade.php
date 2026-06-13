<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verification Code</title>
</head>
<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a;padding:30px 10px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

          <!-- Header -->
          <tr>
            <td align="center" style="padding:20px 0 10px;">
              <span style="color:#d4af37;font-size:28px;font-weight:800;letter-spacing:1px;">PRO CNC</span>
              <span style="color:#a37a39;font-size:28px;font-weight:300;"> MAROC</span>
            </td>
          </tr>

          <!-- Main Card -->
          <tr>
            <td style="background:linear-gradient(145deg,#111,#0a0a0a);border:1px solid #a37a39;border-radius:12px;padding:40px 36px;">

              <!-- Gold Top Line -->
              <table width="60" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="height:3px;background:linear-gradient(90deg,#a37a39,#d4af37);border-radius:2px;"></td>
                </tr>
              </table>

              <!-- Title -->
              <h1 style="color:#d4af37;font-size:22px;font-weight:700;margin:0 0 8px;letter-spacing:0.3px;">
                Verification Code
              </h1>
              <p style="color:#888;font-size:14px;margin:0 0 24px;line-height:1.6;">
                Someone requested to make changes to your PRO CNC MAROC account.
              </p>

              <!-- Divider -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="height:1px;background:linear-gradient(90deg,transparent,#a37a39,transparent);"></td>
                </tr>
              </table>

              <!-- Greeting -->
              <p style="color:#ccc;font-size:15px;margin:0 0 16px;line-height:1.7;">
                Hello <strong style="color:#fff;">{{ $name }}</strong>,
              </p>
              <p style="color:#bbb;font-size:14px;margin:0 0 20px;line-height:1.7;">
                Please use the following verification code to confirm your changes. This code will expire in <strong style="color:#d4af37;">10 minutes</strong>.
              </p>

              <!-- Code Display -->
              <table cellpadding="0" cellspacing="0" style="margin:0 0 28px;" align="center">
                <tr>
                  <td style="background:linear-gradient(145deg,#0d0d0d,#1a1a1a);border:1px solid #a37a39;border-radius:12px;padding:24px 40px;text-align:center;letter-spacing:12px;">
                    <span style="color:#d4af37;font-size:42px;font-weight:800;font-family:'Courier New',Courier,monospace;">{{ $code }}</span>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                <tr>
                  <td style="height:1px;background:linear-gradient(90deg,transparent,#a37a39,transparent);"></td>
                </tr>
              </table>

              <!-- Security Note -->
              <div style="background:rgba(163,122,57,0.08);border:1px solid rgba(163,122,57,0.2);border-radius:8px;padding:14px 16px;margin-bottom:24px;">
                <p style="color:#d4af37;font-size:12px;font-weight:700;margin:0 0 6px;text-transform:uppercase;letter-spacing:0.5px;">
                  &#128274; Security Notice
                </p>
                <p style="color:#999;font-size:13px;margin:0;line-height:1.5;">
                  If you did not request these changes, please ignore this email. Your account details will remain unchanged. Never share this code with anyone.
                </p>
              </div>

              <!-- Footer -->
              <p style="color:#666;font-size:13px;margin:0;line-height:1.6;">
                Best regards,<br>
                <strong style="color:#d4af37;">PRO CNC MAROC Team</strong>
              </p>
            </td>
          </tr>

          <!-- Bottom Footer -->
          <tr>
            <td align="center" style="padding:24px 20px 10px;">
              <p style="color:#555;font-size:11px;margin:0 0 4px;line-height:1.5;">
                PRO CNC MAROC &mdash; Industrial Laser &amp; Fiber Marking Solutions
              </p>
              <p style="color:#444;font-size:11px;margin:0;">
                This is an automated message. Please do not reply directly to this email.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
