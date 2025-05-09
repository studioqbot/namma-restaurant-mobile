import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const SQUARE_API_URL = process.env.NEXT_PUBLIC_APP_SQUARE_API_URL;
const SQUARE_ACCESS_TOKEN = process.env.NEXT_PUBLIC_APP_SQUARE_ACCESS_TOKEN_PROD;

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json(); // Expecting: { object_ids: string[] }

    const response = await axios.post(
      `${SQUARE_API_URL}/v2/catalog/batch-retrieve`,
      {
        object_ids: body.object_ids,
        include_related_objects: true,
        include_category_path_to_root: true,
        include_deleted_objects: false,
      },
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
  } catch (error) {
    const squareError =
      axios.isAxiosError(error) && error.response?.data
        ? error.response.data
        : { message: (error as Error).message };

    console.error('Square API error:', squareError);

    return new NextResponse(
      JSON.stringify({
        error: 'Failed to retrieve catalog items',
        details: squareError,
      }),
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

export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
