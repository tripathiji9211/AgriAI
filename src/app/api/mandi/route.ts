import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const state = searchParams.get('state') || '';
  const district = searchParams.get('district') || '';
  const commodity = searchParams.get('commodity') || '';

  const apiKey = process.env.DATA_GOV_API_KEY;
  if (!apiKey) {
    // Generate intelligent mock data based on user filters for a "live" prototype experience
    const targetState = state || "Uttar Pradesh";
    const targetDistrict = district || "Lucknow";
    const targetCommodity = commodity ? commodity.charAt(0).toUpperCase() + commodity.slice(1) : "Onion";

    return NextResponse.json({ 
      records: [
        {
          state: targetState,
          district: targetDistrict,
          market: targetDistrict,
          commodity: targetCommodity,
          min_price: (1500 + Math.random() * 200).toFixed(0),
          max_price: (2000 + Math.random() * 300).toFixed(0),
          modal_price: (1800 + Math.random() * 100).toFixed(0),
          arrival_date: new Date().toLocaleDateString('en-GB')
        },
        {
          state: targetState,
          district: targetDistrict,
          market: targetDistrict + " Sub-Mandi",
          commodity: targetCommodity === "Wheat" ? "Rice" : "Wheat",
          min_price: "2125",
          max_price: "2250",
          modal_price: "2150",
          arrival_date: new Date().toLocaleDateString('en-GB')
        },
        {
          state: targetState,
          district: targetDistrict,
          market: "Central Mandi",
          commodity: targetCommodity === "Tomato" ? "Potato" : "Tomato",
          min_price: "800",
          max_price: "1200",
          modal_price: "1000",
          arrival_date: new Date().toLocaleDateString('en-GB')
        }
      ] 
    });
  }

  // Base URL for the Daily Wholesale Prices dataset
  let apiUrl = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${apiKey}&format=json`;

  if (state) apiUrl += `&filters[state]=${encodeURIComponent(state)}`;
  if (district) apiUrl += `&filters[district]=${encodeURIComponent(district)}`;
  if (commodity) apiUrl += `&filters[commodity]=${encodeURIComponent(commodity)}`;

  try {
    // Next.js native fetch caching for 1 hour (3600 seconds)
    // This perfectly solves the rate-limiting requirement without needing Redis!
    const res = await fetch(apiUrl, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error('Failed to fetch from data.gov.in');

    const data = await res.json();
    return NextResponse.json({ records: data.records || [] });
  } catch (error) {
    console.error('Mandi API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch mandi prices.' }, { status: 500 });
  }
}
