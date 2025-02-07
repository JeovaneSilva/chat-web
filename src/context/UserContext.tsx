"use client"
import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { buscarUsuario } from "@/services/userService";
import { decodeToken } from "@/utils/token";

interface UserContextType {
  userId: number;
  nomeUser: string;
  fotoPerfil: string;
  setNomeUser: (nome: string) => void;
  setFotoPerfil: (foto: string) => void;
  setUserId: (id: number) => void;
  logOut: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [userId, setUserId] = useState<number>(0);
  const [nomeUser, setNomeUser] = useState<string>("");
  const [fotoPerfil, setFotoPerfil] = useState<string>("");

  useEffect(() => {
    const fetchAndDecodeToken = async () => {
      const token = Cookies.get("token");
      if (token) {
        const decodedToken = decodeToken(token);
        if (decodedToken) {
          setUserId(decodedToken.sub);

          try {
            const res = await buscarUsuario(decodedToken.sub);
            const data = await res.json();
            setFotoPerfil(data.profilePicture);
            setNomeUser(data.name);
          } catch (error) {
            console.error("Erro ao buscar dados do usuário:", error);
          }
        }
      }
    };

    fetchAndDecodeToken();
  }, []);

  const logOut = () => {
    Cookies.remove("token");
    setUserId(0);
    setNomeUser("");
    setFotoPerfil("");
    window.location.href = "/"; // Redirecionar para a página inicial
  };

  return (
    <UserContext.Provider value={{ userId, nomeUser, fotoPerfil, setNomeUser, setFotoPerfil,setUserId, logOut }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext deve ser usado dentro de um UserProvider");
  }
  return context;
};
