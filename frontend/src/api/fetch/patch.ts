export const updateDesktopName = async (id: string, name: string) => {
  const response = await fetch(`http://sovraska.ru/api/v1/desktop/${id}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "*/*",
      Authorization: `Bearer ${localStorage.getItem("access-token")}`,
    },
    body: JSON.stringify({
      desktop_name: name,
    }),
  });
  if (response.ok) {
    return await response.json();
  } else {
    console.log(response);
    return "error in patch.ts updateDesktopName";
  }
};
