"use client";
import Image from "next/image";
import imagelogin from "../assets/imagemlogin.png";

const Login = () => {
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

        {/* Seção do formulário de login */}
        <section className="bg-gray-800 p-8 rounded-lg shadow-md w-[300px] max-w-sm">
          <h2 className="text-3xl font-bold text-[#7E57C2] text-center mb-8">LOGIN</h2>
          <form>
            <div className="mb-4">
              <label htmlFor="username" className="block text-[#7E57C2] mb-2">
                Usuário
              </label>
              <input
                id="username"
                type="text"
                placeholder="Usuário"
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-[#7E57C2] mb-2">
                Senha
              </label>
              <input
                id="password"
                type="password"
                placeholder="Senha"
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
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
