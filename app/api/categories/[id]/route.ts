// app/api/v1/category/[id]/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';
import { Params } from "@/types/Params";

export async function GET(req: Request, { params }: Params) {
    const id = await params;
    const accessToken = (await cookies()).get("accessToken")?.value;
    
    if (!accessToken) {
        return NextResponse.json(
          { error: "Unauthorized: Токен не предоставлен" },
          { status: 401 }
        );
    }

    try {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/category/${id}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                },
            },
        );

        return NextResponse.json(response.data);
    } catch (error) {
        console.error("Server error:", error);

        if (axios.isAxiosError(error)) {
            return new Response(error.response?.data.message || "Failed to fetch category", {
                status: error.response?.status || 500,
            });
        }

        return new Response("Server error", { status: 500 });
    }
}