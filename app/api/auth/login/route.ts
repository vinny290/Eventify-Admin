import axios from "axios";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  try {
    const { data, status } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
      { email, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return new Response(JSON.stringify(data), { status });
  } catch (error) {
    console.error("Server error:", error);

    if (axios.isAxiosError(error)) {
      return new Response(error.response?.data?.message || "Failed to login", {
        status: error.response?.status || 500,
      });
    }

    return new Response("Server error", { status: 500 });
  }
}
