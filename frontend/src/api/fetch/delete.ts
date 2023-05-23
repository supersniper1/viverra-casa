export const deleteDesktop = async (id: string) => {
  const response = await fetch(`http://sovraska.ru/api/v1/desktop/${id}/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Accept: "*/*",
      Authorization: `Bearer ${localStorage.getItem("access-token")}`,
    },
  });
  if (response.ok) {
    return await response.json();
  }
};
