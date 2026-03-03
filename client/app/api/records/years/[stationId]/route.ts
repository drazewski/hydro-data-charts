import { NextRequest, NextResponse } from 'next/server';

const expressBaseUrl = process.env.EXPRESS_BASE_URL;

type YearlyRecord = {
  year: number;
  avgLevel: number | null;
  avgFlow: number | null;
  avgTemperature: number | null;
};

const avgFieldMap: Record<string, keyof YearlyRecord> = {
  level: 'avgLevel',
  flow: 'avgFlow',
  temperature: 'avgTemperature',
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ stationId: string }> }
) {
  const { stationId } = await params;
  const type = request.nextUrl.searchParams.get('type') ?? 'level';

  const response = await fetch(`${expressBaseUrl}/api/records/yearly/${stationId}`);
  const records: YearlyRecord[] = await response.json();

  const avgField = avgFieldMap[type] ?? 'avgLevel';
  const years = records
    .filter((r) => r[avgField] != null)
    .map((r) => r.year)
    .sort((a, b) => a - b);

  return NextResponse.json({ years });
}
