export async function POST(req: Request) {
    const { token  } = await req.json()
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ token  }),
      })
  
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Ошибка при обновлении на внешнем сервере:', errorText)
        return new Response(JSON.stringify({ message: errorText }), { status: response.status })
      }
  
      const data = await response.json()
      return new Response(JSON.stringify(data), { status: 200 })
    } catch (e: unknown) {
      console.error('Ошибка сервера в /api/auth/refresh:', e)
      return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 })
    }
  }
  