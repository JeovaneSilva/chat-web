import useLoading from "@/hooks/useLoading";
import { forgotPassword } from "@/services/userService";
import {
  emailRedefinirSenhaError,
  emailRedefinirSenhaOk,
} from "@/utils/toastify";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const useForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const { loading, setLoading } = useLoading();
  const [canSend, setCanSend] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setIsEmailValid(validateEmail(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSend) {
      toast.warn("Aguarde 30 segundos antes de enviar outro e-mail.");
      return;
    }

    setLoading(true);
    if (!isEmailValid) {
      toast.error("Por favor, insira um e-mail válido.");
      setLoading(false);
      return;
    }

    try {
      const response = await forgotPassword(email);
      const data = await response.json();

      if (response.ok) {
        emailRedefinirSenhaOk(data.message);
        setCanSend(false);
        setTimeLeft(30); // Inicia o temporizador de 30 segundos
      } else {
        emailRedefinirSenhaError(data.message);
      }
    } catch (error) {
      toast.error("Erro ao conectar ao servidor. Tente novamente.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Efeito para atualizar o temporizador a cada segundo
  useEffect(() => {
    if (timeLeft > 0) {
      const intervalId = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      // Limpa o intervalo quando o tempo expira
      return () => clearInterval(intervalId);
    } else if (timeLeft === 0) {
      setCanSend(true);
    }
  }, [timeLeft]);

  return {
    handleSubmit,
    email,
    handleChange,
    isEmailValid,
    loading,
    canSend,
    timeLeft,
  };
};

export default useForgotPassword;
