import { NextResponse } from 'next/server';
import { cookies } from "next/headers";
import axios from 'axios';

export async function GET() {
    const accessToken = (await cookies()).get("accessToken")?.value;
      if (!accessToken) {
        return NextResponse.json(
          { error: "Unauthorized: Токен не предоставлен" },
          { status: 401 }
        );
      }
    
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/category`,{
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        return NextResponse.json(response.data);
    } catch (error) {
        console.error('Error fetching categories:', error);

        return NextResponse.json(
            { error: 'Failed to fetch categories' },
            { status: 500 }
        );
    }
}