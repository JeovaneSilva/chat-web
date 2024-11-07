"use client";
import Image from "next/image";
import imagelogin from "../assets/imagemlogin.svg";
import Link from "next/link";
import LoadingSpinner from "./Loading";
import useUser from "@/hooks/useUser";
import { FiEye, FiEyeOff } from "react-icons/fi"; // Ícones de olho

const Login = () => {
  const {
    loginUser,
    setEmail,
    setSenha,
    loading,
    togglePasswordVisibility,
    showPassword,
  } = useUser();

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="flex flex-col md:flex-row items-center justify-center">
        <aside className="hidden md:flex flex-col items-center mr-12">
          <div>
            <Image
              src={imagelogin}
              alt="Astronaut Cat"
              width={400}
              height={400}
            />
          </div>
        </aside>

        <section className="bg-gray-800 p-8 rounded-lg shadow-md w-[350px] max-w-sm">
          <h2 className="text-2xl font-bold text-[#4b98cc] text-center mb-8">
            LOGIN
          </h2>
          <form onSubmit={loginUser}>
            <div className="mb-4">
              <label className="block text-[#4b98cc] mb-2">Email</label>
              <input
                type="email"
                placeholder="Usuário"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                required
              />
            </div>

            <div className="mb-1 relative">
              <label className="block text-[#4b98cc] mb-2">Senha</label>
              <input
                type={showPassword ? "text" : "password"} // Alterna entre texto e senha
                placeholder="Senha"
                onChange={(e) => setSenha(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 pr-10" // Espaço para o ícone
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute mt-3 mr-1 right-2  text-gray-600"
              >
                {showPassword ? (
                  <FiEyeOff className="text-[15px]" />
                ) : (
                  <FiEye className="text-[15px]" />
                )}
              </button>
            </div>

            <div className="mb-5 text-right">
              <Link
                className="text-white text-sm hover:text-[#4180ab]"
                href="/Esqueceu-senha"
              >
                Esqueceu a senha?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-[#4b98cc] hover:bg-[#1f3f55] text-white font-bold py-2 px-4 rounded-lg transition duration-300"
            >
              LOGIN
            </button>
          </form>
          <div className="flex w-full justify-between text-white mt-4">
            <p>Ainda não possui conta? </p>
            <span className="text-[#77a8c9] hover:text-[#4180ab]">
              <Link href="/Cadastro">Cadastrar-se</Link>{" "}
            </span>
          </div>
        </section>
      </div>

      {loading && <LoadingSpinner />}
    </main>
  );
};

export default Login;
