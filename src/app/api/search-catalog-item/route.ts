/* eslint-disable */


import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const SQUARE_API_URL = process.env.NEXT_PUBLIC_APP_SQUARE_API_URL;
const SQUARE_ACCESS_TOKEN = process.env.NEXT_PUBLIC_APP_SQURAE_ACCESS_TOKEN_PROD;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); // Get the POST body

    const response = await axios.post(
      `${SQUARE_API_URL}/v2/catalog/search-catalog-items`,
      body,
      {
        headers: {
          'Content-Type': 'application/json',
          'Square-Version': '2025-04-16',
          Authorization: `Bearer ${SQUARE_ACCESS_TOKEN}`,
        },
      }
    );

    return new NextResponse(JSON.stringify(response.data), {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Content-Type': 'application/json',
      },
    });
  } catch (error: any) {
    console.error('Square API error:', error?.response?.data || error.message);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to search catalog items' }),
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Content-Type': 'application/json',
        },
      }
    );
  }
}

// Optional: Handle preflight requests if needed
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
