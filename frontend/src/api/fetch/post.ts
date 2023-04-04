export const refreshAccessTokenGet = async (token: string) => {
    const response = await fetch('http://127.0.0.1:8000/api/v1/auth/', {
      method: "POST",
      body: JSON.stringify({
        "token": token
      })
    })
    if (response.ok) {
        const json = await response.json()
        return await json
    } else {
        console.log("error in post.ts refreshAccessTokenGet " + response.status)
        return "error in post.ts refreshAccessTokenGet"
    }
  }