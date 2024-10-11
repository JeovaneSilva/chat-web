
const getCookie = (name: string): string | null => {
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${name}=`));
    return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
  };
  
const token = getCookie("token");

export const BuscarUsuarios = async () => {
    const response = await fetch("http://localhost:3333/users", {
        method: "GET",
        headers: { authorization: `Bearer ${token}` },
        credentials: "include",
      });

      return response.json()
}