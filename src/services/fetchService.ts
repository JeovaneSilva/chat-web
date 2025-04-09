import Cookies from "js-cookie";
import { useUserContext } from "@/context/UserContext";
import { jwtDecode } from "jwt-decode";

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const { logOut } = useUserContext();
  let token = Cookies.get("token");

  // Verifica se o token está presente e válido
  const isTokenValid = (token: string): boolean => {
    try {
      const decoded: any = jwtDecode(token);
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  };

  if (!token || !isTokenValid(token)) {
    logOut(); // remove token, zera o contexto e redireciona
    return Promise.reject(new Error("Token inválido ou expirado."));
  }

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    logOut();
    return Promise.reject(new Error("Usuário não autorizado."));
  }

  return response;
};
