<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $subject }}</title>
    <style>
        /* General Styles */
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #444444;
            background-color: #f4f4f9;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 30px auto;
            background-color: #ffffff;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        /* Header Section */
        .email-header {
            background-color: #7FEAFE; /* Primary Blue */
            color: #ffffff;
            text-align: center;
            padding: 20px;
        }
        .email-header img {
            max-height: 60px;
            margin-bottom: 10px;
        }
        .email-header h1 {
            font-size: 28px;
            margin: 0;
            font-weight: bold;
        }

        /* Body Section */
        .email-body {
            padding: 25px;
        }
        .email-body p {
            margin: 15px 0;
            font-size: 16px;
            color: #555555;
        }
        .email-body strong {
            font-weight: bold;
            color: #333333;
        }

        /* Footer Section */
        .email-footer {
            background-color: #f9f9f9;
            text-align: center;
            padding: 15px;
            font-size: 14px;
            color: #666666;
            border-top: 1px solid #e0e0e0;
        }
        .email-footer a {
            color: #00c8ff;
            text-decoration: none;
        }
        .email-footer a:hover {
            text-decoration: underline;
        }

        /* Responsive Design */
        @media (max-width: 600px) {
            .email-container {
                width: 90%;
                margin: 20px auto;
            }
            .email-header h1 {
                font-size: 24px;
            }
            .email-body p {
                font-size: 14px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="email-header">
            @if ($siteLogo)
                <img src="{{ $siteLogo }}" alt="{{ $siteName }} Logo">
            @endif
            <h1>{{ $siteName }}</h1>
        </div>

        <!-- Body -->
        <div class="email-body">
            <p><strong>Subject:</strong> {{ $subject }}</p>
            <p>{{ $userMessage }}</p>
        </div>

        <!-- Footer -->
        <div class="email-footer">
            <p>Thank you for being a part of {{ $siteName }}.</p>
            <p>Need help? Contact us at <a href="mailto:support@kidstick.com">support@kidstick.com</a></p>
        </div>
    </div>
</body>
</html>
