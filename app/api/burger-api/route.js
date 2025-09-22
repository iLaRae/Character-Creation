// app/api/bobs-api/route.js
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    // Fetch characters from Bob's Burgers API
    const res = await fetch("https://bobsburgers-api.herokuapp.com/burgerOfTheDay/");
    if (!res.ok) {
      throw new Error(`Failed to fetch from Bob's Burgers API: ${res.status}`);
    }

    const data = await res.json();

    // Return the data as JSON
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching Bob's Burgers data:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch Bob's Burgers data" },
      { status: 500 }
    );
  }
}
