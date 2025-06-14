import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.refresh) {
      return NextResponse.json(
        { message: "Refresh token is required" },
        { status: 400 }
      );
    }

    const { data, status } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth`,
      { refresh: body.refresh },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    return NextResponse.json(data, { status });
  } catch (error) {
    console.error("Refresh error:");
    if (axios.isAxiosError(error)) {
      console.error("Axios error details:", {
        url: error.config?.url,
        method: error.config?.method,
        data: error.config?.data,
        response: error.response?.data,
      });
      return NextResponse.json(
        error.response?.data || { message: "Auth service error" },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
