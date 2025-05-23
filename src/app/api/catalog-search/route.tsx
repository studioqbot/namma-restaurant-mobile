import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req : NextRequest) {
  const body = await req.json(); 

  try {
    const response = await axios.post(`${process.env.SQUIRE_BASE_URL}/catalog/search`, body, {
      headers: {
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error },
      { status: 500 }
    );
  }
}
