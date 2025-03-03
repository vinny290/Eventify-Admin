// app/event/create/route.ts

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';

export const POST = async (req: Request) => {
  try {
    const accessToken = (await cookies()).get("accessToken")?.value;
        if (!accessToken) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

    const eventData = await req.json();

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/events`,
      eventData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return NextResponse.json(response.data, { status: response.status });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || 'Ошибка при создании ивента' },
      { status: 500 }
    );
  }
};
