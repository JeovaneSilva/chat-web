"use client";
import Image from "next/image";
import imagelogin from "../assets/imagemlogin.png";
import Link from "next/link";
import LoadingSpinner from "./Loading";
import useUser from "@/hooks/useUser";

const Login = () => {
  const { loginUser, setEmail, setSenha, loading } = useUser();

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
          <h2 className="text-2xl font-bold text-[#7E57C2] text-center mb-8">
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
          <div className="flex w-full justify-between text-white mt-4">
            <p>Ainda não possui conta? </p>
            <span className="text-[#7E57C2] hover:text-green-600">
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
