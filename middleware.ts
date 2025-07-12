import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Service Unavailable</title>
    <style>
      body {
        background: #111827;
        color: #f9fafb;
        font-family: 'Segoe UI', sans-serif;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        margin: 0;
        flex-direction: column;
        text-align: center;
        padding: 1rem;
      }
      h1 {
        font-size: 2.5rem;
        margin-bottom: 1rem;
      }
      p {
        font-size: 1.1rem;
        color: #9ca3af;
      }
    </style>
  </head>
  <body>
    <h1>🚫 Access Restricted</h1>
    <p>This service is temporarily unavailable. Please contact the developer for access.</p>
  </body>
  </html>
`;

export function middleware(request: NextRequest) {
    return new NextResponse(html, {
        status: 503,
        headers: {
            'Content-Type': 'text/html',
        },
    });
}
