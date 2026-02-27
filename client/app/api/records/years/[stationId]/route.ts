import { NextRequest, NextResponse } from 'next/server';

const expressBaseUrl = process.env.EXPRESS_BASE_URL;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ stationId: string }> }
) {
  const { stationId } = await params;

  const response = await fetch(`${expressBaseUrl}/api/records/yearly/${stationId}`);
  const records: { year: number }[] = await response.json();

  const years = records.map((r) => r.year).sort((a, b) => a - b);

  return NextResponse.json({ years });
}
