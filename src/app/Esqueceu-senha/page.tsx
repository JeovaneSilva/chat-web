"use client";
import ForgatPasword from "../../assets/Forgotpassword.svg";
import Image from "next/image";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaArrowLeftLong } from "react-icons/fa6";
import Link from "next/link";
import LoadingSpinner from "../Loading";
import useForgotPassword from "./hooks/useForgotPassword";

const EsqueceuSenha = () => {
  const {
    handleSubmit,
    email,
    handleChange,
    isEmailValid,
    loading,
    canSend,
    timeLeft,
  } = useForgotPassword();

  return (
    <div className="min-h-screen flex items-center flex-col justify-center bg-[#84c0e9]">
      <header className="w-screen flex items-center pl-10 fixed top-0 h-[100px] gap-5">
        <Link href="/">
          <FaArrowLeftLong className=" text-3xl sm:text-4xl text-[#2a5572]" />
        </Link>
        <h2 className="text-[#2a5572] text-2xl sm:text-3xl">
          Esqueceu a Senha
        </h2>
      </header>
      <div className="flex flex-col items-center justify-center">
        <div className="mt-[-10px]">
          <Image
            src={ForgatPasword}
            alt="Redefinir senha"
            width={350}
            height={350}
          />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <input
              type="email"
              placeholder="Digite seu e-mail"
              className="w-[280px] h-[40px] mb-2 rounded-lg p-2"
              value={email}
              onChange={handleChange}
              required
            />
            {!isEmailValid && (
              <p className="text-red-600 mb-2 text-center">E-mail inválido</p>
            )}
            <div className="flex mt-3 justify-center">
              <button
                type="submit"
                disabled={!email || !isEmailValid || !canSend}
                className={`text-white text-lg px-10 py-2 rounded-lg ${
                  email && isEmailValid && canSend
                    ? "bg-[#4b98cc]"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {canSend ? "Enviar" : `Aguarde ${timeLeft}s`}
              </button>
            </div>
          </div>
        </form>
      </div>
      {loading && <LoadingSpinner />}
      <ToastContainer />
    </div>
  );
};

export default EsqueceuSenha;
