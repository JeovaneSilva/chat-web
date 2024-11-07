"use client";
import AvatarEditor from "react-avatar-editor";
import Link from "next/link";
import Image from "next/image";
import imagelogin from "../../assets/imagemlogin.svg";
import useUser from "@/hooks/useUser";
import LoadingSpinner from "../Loading";
import { FiEye, FiEyeOff } from "react-icons/fi"; // Ícones de olho

const Cadastro = () => {
  const {
    step,
    cadastrarUsuario,
    nextStep,
    setName,
    name,
    email,
    setEmail,
    setSenha,
    senha,
    setConfirmarSenha,
    confirmarSenha,
    handleImageChange,
    profilePicture,
    editorRef,
    scale,
    setScale,
    previousStep,
    loading,
    showConfirmPassword,
    showPassword,
    toggleConfirmPasswordVisibility,
    togglePasswordVisibility
  } = useUser();


  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-900">
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
        <h2 className="text-xl font-bold text-[#4b98cc] text-center mb-8">
          CADASTRO - ETAPA {step} de 3
        </h2>
        <form onSubmit={step === 3 ? cadastrarUsuario : nextStep}>
          {/* Etapa 1: Nome e Email */}
          {step === 1 && (
            <div>
              <div className="mb-4">
                <label className="block text-[#4b98cc] mb-2">Nome</label>
                <input
                  type="text"
                  placeholder="Nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-[#4b98cc] mb-2">Email</label>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                  required
                />
              </div>
            </div>
          )}

          {/* Etapa 2: Senha e Confirmar Senha */}
          {step === 2 && (
            <div>
              <div className="mb-4 relative">
                <label className="block text-[#4b98cc] mb-2">Senha</label>
                <input
                  type={showPassword ? "text" : "password"} // Alterna entre texto e senha
                  placeholder="Senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 pr-10" // Espaço para o ícone
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute mt-3 mr-1 right-2  text-gray-300"
                >
                  {showPassword ? (
                    <FiEyeOff className="text-[15px]" />
                  ) : (
                    <FiEye className="text-[15px]" />
                  )}
                </button>
              </div>

              <div className="mb-6 relative">
                <label className="block text-[#4b98cc] mb-2">
                  Confirmar Senha
                </label>
                <input
                  type={showConfirmPassword ? "text" : "password"} // Alterna entre texto e senha
                  placeholder="Confirmar Senha"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 pr-10" // Espaço para o ícone
                  required
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute mt-3 mr-1 right-2  text-gray-300"
                >
                  {showPassword ? (
                    <FiEyeOff className="text-[15px]" />
                  ) : (
                    <FiEye className="text-[15px]" />
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Etapa 3: Foto de Perfil (Opcional) */}
          {step === 3 && (
            <div>
              <div className="mb-6 text-center">
                <label className="block text-[#4b98cc] mb-2">
                  Foto de Perfil
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>

              {/* Visualização e ajuste da imagem (com opção de zoom) */}
              {profilePicture && (
                <div className="mb-6 flex flex-col justify-center items-center">
                  <div
                    className="relative overflow-hidden flex justify-center items-center"
                    style={{
                      width: "200px",
                      height: "200px",
                      border: "10px solid rgba(255, 255, 255, 0.5)",
                      borderRadius: "50%",
                      boxShadow: "0 0 8px rgba(0, 0, 0, 0.5)",
                      background: "rgba(0, 0, 0, 0.5)",
                    }}
                  >
                    <AvatarEditor
                      ref={editorRef}
                      image={profilePicture}
                      width={200}
                      height={200}
                      border={50}
                      borderRadius={100}
                      color={[255, 255, 255, 0.6]}
                      scale={scale}
                      rotate={0}
                    />
                  </div>
                  <input
                    type="range"
                    value={scale}
                    min="1"
                    max="2"
                    step="0.1"
                    onChange={(e) => setScale(parseFloat(e.target.value))}
                    className="w-full mt-4"
                  />
                </div>
              )}
            </div>
          )}

          {/* Botões para avançar/retroceder etapas */}
          <div className="flex justify-center gap-6">
            {step > 1 && (
              <button
                type="button"
                onClick={previousStep}
                className="bg-gray-600 text-white font-bold py-2 px-4 rounded-lg"
              >
                Voltar
              </button>
            )}
            <button
              type="submit"
              className="bg-[#4b98cc] hover:bg-[#1f3f55] text-white font-bold py-2 px-4 rounded-lg transition duration-300"
            >
              {step === 3 ? "Finalizar Cadastro" : "Próxima Etapa"}
            </button>
          </div>
        </form>
        <div className="flex w-full justify-between text-white mt-4">
          <p>Já possui uma conta? </p>
          <span className="text-[#77a8c9] hover:text-[#4180ab]">
            <Link href="/"> Faça Login</Link>
          </span>
        </div>
      </section>
      {loading && <LoadingSpinner />}
    </main>
  );
};

export default Cadastro;
