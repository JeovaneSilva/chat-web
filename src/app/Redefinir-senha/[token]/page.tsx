"use client";
import LoadingSpinner from "@/app/Loading";
import Image from "next/image";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ResetPasword from "../../../assets/Resetpassword.svg";
import { FiEye, FiEyeOff } from "react-icons/fi";
import useResetPassword from "./hooks/useResetPassword";

const RedefinirSenha = () => {
 const {loading,setSenha,handleSubmit,showPassword,togglePasswordVisibility,senha} = useResetPassword()

  return (
    <div className="min-h-screen flex items-center flex-col justify-center bg-[#84c0e9]">
      <header className="w-screen flex items-center pl-10 fixed top-0 h-[100px] gap-5">
        <h2 className="text-[#2a5572] text-2xl sm:text-3xl">Redefinir Senha</h2>
      </header>

      <div className="flex flex-col items-center justify-center">
        <div className="mt-[-10px]">
          <Image
            src={ResetPasword}
            alt="Redefinir senha"
            width={350}
            height={350}
          />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Nova Senha"
              value={senha}
              className="w-[280px] h-[40px] mb-2 rounded-lg p-2 pr-10 outline-none"
              onChange={(e) => setSenha(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute mt-3 mr-2 right-2  text-gray-500"
            >
              {showPassword ? (
                <FiEyeOff className="text-[15px]" />
              ) : (
                <FiEye className="text-[15px]" />
              )}
            </button>

            <div className="flex mt-3 justify-center">
              <button
                type="submit"
                disabled={!senha}
                className={`text-white text-lg px-10 py-2 rounded-lg ${
                  senha ? "bg-[#4b98cc]" : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Redefinir Senha
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

export default RedefinirSenha;
