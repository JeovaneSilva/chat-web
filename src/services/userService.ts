import { getCookie } from "@/utils/token";

const token = getCookie("token");

export const BuscarUsuarios = async () => {
  const response = await fetch("http://localhost:3333/users", {
    method: "GET",
    headers: { authorization: `Bearer ${token}` },
    credentials: "include",
  });

  return response.json();
};

export const Logar = async (email:string,senha:string) => {
  const response = await fetch("http://localhost:3333/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: email,
      password: senha,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response
};

export const Cadastrar = async (formData:FormData) => {
  const response = await fetch("http://localhost:3333/users", {
    method: "POST",
    body: formData,
  });

  return response
};
