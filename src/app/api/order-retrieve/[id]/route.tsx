import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req : NextRequest, { params }: { params: Promise<{ id: string }> }) {

  const order_id = (await params).id 

  try {
    const response = await axios.get(`${process.env.SQUIRE_BASE_URL}/orders/${order_id}`, {
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
