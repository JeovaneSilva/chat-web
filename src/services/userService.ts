import { getCookie } from "@/utils/token";

const token = getCookie("token");

export const BuscarUsuarios = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}users`, {
    method: "GET",
    headers: { authorization: `Bearer ${token}` },
    credentials: "include",
  });

  return response.json();
};

export const Logar = async (email: string, senha: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}auth/login`, {
    method: "POST",
    body: JSON.stringify({
      email: email,
      password: senha,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response;
};

export const Cadastrar = async (formData: FormData) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}users`, {
    method: "POST",
    body: formData,
  });

  return response;
};

export const forgotPassword = async (email:string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}auth/recuperar-senha`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    }
  );
  return response
}
