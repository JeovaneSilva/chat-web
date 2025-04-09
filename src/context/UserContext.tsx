"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { buscarUsuario } from "@/services/userService";
import { usePathname, useRouter } from "next/navigation";
import { DecodedToken } from "@/types/User";

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
  const pathname = usePathname();
  const router = useRouter();
  const [userId, setUserId] = useState<number>(0);
  const [nomeUser, setNomeUser] = useState<string>("");
  const [fotoPerfil, setFotoPerfil] = useState<string>("");

  const isTokenValid = (token: string): boolean => {
    try {
      const decoded: DecodedToken = jwtDecode(token);
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  };

  const logOut = useCallback(() => {
    Cookies.remove("token");
    setUserId(0);
    setNomeUser("");
    setFotoPerfil("");

    if (pathname !== "/") {
      router.push("/");
    }
  }, [pathname, router]);

  const verifyAndFetchUser = useCallback(async () => {
    const token = Cookies.get("token");

    if (!token || !isTokenValid(token)) {
      logOut();
      return;
    }

    const decoded: DecodedToken = jwtDecode(token);
    if (decoded) {
      setUserId(decoded.sub);
      try {
        const res = await buscarUsuario(decoded.sub);
        const data = await res.json();
        setFotoPerfil(data.profilePicture);
        setNomeUser(data.name);
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        logOut();
      }
    }
  }, [logOut]);

  useEffect(() => {
    verifyAndFetchUser();
  }, [verifyAndFetchUser]);

  return (
    <UserContext.Provider
      value={{
        userId,
        nomeUser,
        fotoPerfil,
        setNomeUser,
        setFotoPerfil,
        setUserId,
        logOut,
      }}
    >
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
