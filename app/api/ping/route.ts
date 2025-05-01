// app/api/ping/route.ts
import { getBookings } from "@/app/actions/bookings";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await getBookings(); // this will touch the database
    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Ping failed:", error);
    return NextResponse.json({ status: "error" }, { status: 500 });
  }
}
