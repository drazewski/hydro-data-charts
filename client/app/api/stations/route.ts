import { NextResponse } from 'next/server';

const expressBaseUrl = process.env.EXPRESS_BASE_URL;

export async function GET() {
  const response = await fetch(`${expressBaseUrl}/api/stations`);
  const data = await response.json();
  return NextResponse.json(data);
}
