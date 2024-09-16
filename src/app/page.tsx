
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [userId, setUserId] = useState("");
  const router = useRouter();

  // Função de login
  const onLogin = async () => {
    if (!userId) {
      alert("Por favor, insira um ID de usuário válido.");
      return;
    }

    // Redireciona para a página de chat com o ID do usuário
    router.push(`/chat?userId=${userId}`);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Digite seu ID de usuário"
          className="border p-2 rounded w-full mb-4"
        />
        <button
          onClick={onLogin}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full"
        >
          Entrar
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
