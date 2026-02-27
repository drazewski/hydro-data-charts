import { NextRequest, NextResponse } from 'next/server';

const expressBaseUrl = process.env.EXPRESS_BASE_URL;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ stationId: string }> }
) {
  const { stationId } = await params;
  const searchParams = request.nextUrl.searchParams;
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  let url = `${expressBaseUrl}/api/records/yearly/${stationId}`;
  if (from && to) url += `?from=${from}&to=${to}`;

  const response = await fetch(url);
  const data = await response.json();
  return NextResponse.json(data);
}
