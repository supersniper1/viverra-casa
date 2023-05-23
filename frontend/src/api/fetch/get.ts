export const getDesktops = async () => {
  const response = await fetch("http://sovraska.ru/api/v1/desktop/", {
    method: "GET",
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
