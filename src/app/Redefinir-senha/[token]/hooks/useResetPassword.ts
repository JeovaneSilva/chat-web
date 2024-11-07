import useLoading from "@/hooks/useLoading";
import useUser from "@/hooks/useUser";
import { senhaRedefinidaError, senhaRedefinidaOk } from "@/utils/toastify";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

const useResetPassword = () => {
    const { token } = useParams();
    const [senha, setSenha] = useState("");
    const { loading, setLoading } = useLoading();
    const { showPassword, togglePasswordVisibility } = useUser();
  
    const handleSubmit = async (e: React.FormEvent) => {
      setLoading(true);
      e.preventDefault();
  
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}auth/redifinirsenha/${token}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ novaSenha: senha }),
          }
        );
  
        const data = await response.json();
        setLoading(false);
  
        if (response.ok) {
          senhaRedefinidaOk(data.message);
        } else {
          senhaRedefinidaError(data.message);
        }
      } catch (error) {
        setLoading(false);
        toast.error("Erro ao conectar ao servidor. Tente novamente.");
        console.error(error);
      }
    };
    return {
        loading,senha,setSenha,handleSubmit,showPassword,togglePasswordVisibility
    }
}

export default useResetPassword