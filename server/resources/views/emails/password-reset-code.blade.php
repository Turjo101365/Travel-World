<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Code</title>
</head>
<body style="margin:0;padding:0;background:#f5f7fb;font-family:Arial,sans-serif;color:#1f2937;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:24px 12px;">
        <tr>
            <td align="center">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border-radius:10px;overflow:hidden;border:1px solid #e5e7eb;">
                    <tr>
                        <td style="background:#0f766e;padding:16px 24px;color:#ffffff;font-size:20px;font-weight:700;">
                            {{ config('app.name', 'Travel-World') }}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:24px;">
                            <p style="margin:0 0 14px 0;">Hi {{ $recipientName ?: 'Traveler' }},</p>
                            <p style="margin:0 0 14px 0;">We received a request to reset your password.</p>
                            <p style="margin:0 0 10px 0;">Use this reset code:</p>
                            <div style="font-size:20px;font-weight:700;letter-spacing:1px;background:#f3f4f6;border:1px dashed #9ca3af;border-radius:8px;padding:14px 16px;word-break:break-all;">{{ $code }}</div>
                            <p style="margin:14px 0 0 0;">This code expires in {{ $expireMinutes }} minutes.</p>
                            <p style="margin:14px 0 0 0;">If you did not request this, please ignore this email.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
