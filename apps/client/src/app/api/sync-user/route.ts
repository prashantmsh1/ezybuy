import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { uid, email } = await request.json();

        // Here, send data to your backend service
        // For example, call your user-service API
        const backendUrl = process.env.BACKEND_URL || "http://localhost:3001"; // Adjust to your backend URL

        const response = await fetch(`${backendUrl}/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ uid, email }),
        });

        if (!response.ok) {
            throw new Error("Failed to sync user");
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to sync user" }, { status: 500 });
    }
}
