import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // ... your logic ...
    return NextResponse.json({ success: true });
  } catch (error) {
    // The "Fail-Fast Contract" requires these specific fields
    return NextResponse.json(
      { 
        error: "Failed to store preferences",
        code: "INTERNAL_SERVER_ERROR", 
        timestamp: new Date().toISOString() 
      },
      { status: 500 }
    );
  }
}