import { DecodedToken } from "@/types/User";
import { jwtDecode } from "jwt-decode";

// Função para salvar o token JWT nos cookies
export const setCookie = (name: string, value: string, days: number) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; expires=${expires}; path=/`;
};

export const decodeToken = (token: string): DecodedToken | null => {
  try {
    const decoded: DecodedToken = jwtDecode(token);
    return decoded;
  } catch (error) {
    console.error("Erro ao decodificar o token JWT:", error);
    return null;
  }
};


