export const refreshAccessTokenGet = async (token: string) => {
  const response = await fetch("http://127.0.0.1/api/v1/auth/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "*/*",
    },
    body: JSON.stringify({
      token: token,
    }),
  });
  if (response.ok) {
    const json = await response.json();
    localStorage.setItem("access-token", json.access);
    localStorage.setItem("refresh-token", json.refresh);
  } else {
    console.log(response);
    return "error in post.ts refreshAccessTokenGet";
  }
};
