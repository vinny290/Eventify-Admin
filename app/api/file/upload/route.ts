import { NextResponse } from 'next/server'
import { cookies } from "next/headers";
import axios from 'axios'

export const POST = async (req: Request) => {
    try {
        const accessToken = (await cookies()).get("accessToken")?.value;
      if (!accessToken) {
        return NextResponse.json(
          { error: "Unauthorized: Токен не предоставлен" },
          { status: 401 }
        );
      }

        const formData = await req.formData();
        const files = formData.getAll("file");

        const uploadedId: string[] = [];
        
        for (const file of files) {
            const uploadFormData = new FormData();
            uploadFormData.append("file", file);

            // Отправляем файл на внешний сервер
            const response = await axios.post<{ 
                id: string // Важно: ожидаем отдельный ID, а не массив
            }>(`${process.env.NEXT_PUBLIC_API_URL}/files`, uploadFormData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            uploadedId.push(response.data.id); // Добавляем ID как строку
        }

        return NextResponse.json({ id: uploadedId }, { status: 200 });
        
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json(
            { error: "File upload failed" },
            { status: 500 }
        );
    }
};