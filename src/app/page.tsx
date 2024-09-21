"use client";
import Image from "next/image";
import imagelogin from "../assets/imagemlogin.png";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Importando useRouter

const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const router = useRouter(); 

  // Função para salvar o token JWT nos cookies
  const setCookie = (name: string, value: string, days: number) => {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
  };

  const loginUser = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3333/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: email,
          password: senha,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`Erro no login: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      const token = data.access_token;

      // Salvando o token JWT nos cookies
      setCookie("token", token, 1); // Expira em 7 dias

      if (data.access_token) {
        router.push("/chat");
      } else {
        console.error("Token de acesso não encontrado.");
      }
      
    } catch (error) {
      console.error("Erro ao fazer login:", error);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="flex flex-col md:flex-row items-center justify-center">
        <aside className="hidden md:flex flex-col items-center  mr-12">
          <div className="">
            <Image
              src={imagelogin}
              alt="Astronaut Cat"
              width={400}
              height={400}
            />
          </div>
        </aside>

        <section className="bg-gray-800 p-8 rounded-lg shadow-md w-[350px] max-w-sm">
          <h2 className="text-3xl font-bold text-[#7E57C2] text-center mb-8">
            LOGIN
          </h2>
          <form onSubmit={loginUser}>
            <div className="mb-4">
              <label className="block text-[#7E57C2] mb-2">Email</label>
              <input
                type="email"
                placeholder="Usuário"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-[#7E57C2] mb-2">Senha</label>
              <input
                type="password"
                placeholder="Senha"
                onChange={(e) => setSenha(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#7E57C2] hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
            >
              LOGIN
            </button>
          </form>
        </section>
      </div>
    </main>
  );
};

export default Login;
