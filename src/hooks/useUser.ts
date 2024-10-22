import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { setCookie } from "@/utils/token";
import { Cadastrar, Logar } from "@/services/userService";
import AvatarEditor from "react-avatar-editor";

const defaultProfilePicture = "/assets/defaultProfile.png";

const useUser = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [step, setStep] = useState(1); // Controla as etapas
  const [name, setName] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null); // Imagem selecionada pelo usuário
  const [scale, setScale] = useState<number>(1); // Estado para o zoom da imagem
  const editorRef = useRef<AvatarEditor>(null);
  const router = useRouter();

  //  LOGIN
  const loginUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await Logar(email, senha);

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
    setLoading(false);
  };

  //   CADASTRO
  // Função para avançar as etapas
  const nextStep = (e: React.FormEvent) => {
    e.preventDefault(); // Evita o recarregamento da página
    if (step === 1) {
      // Adicione qualquer validação de nome/email aqui, se necessário
      setStep(2);
    } else if (step === 2) {
      if (senha !== confirmarSenha) {
        alert("As senhas não coincidem!");
        return;
      }
      setStep(3);
    }
  };

  // Função para retroceder as etapas
  const previousStep = () => {
    if (step > 1) setStep(step - 1);
  };

  // Função para enviar os dados de cadastro
  const cadastrarUsuario = async (e: React.FormEvent) => {
    e.preventDefault(); // Impede o recarregamento da página
    setLoading(true)

    let profilePictureBlob: Blob | null = null;
    if (editorRef.current) {
      const canvas = editorRef.current.getImage(); // Obtém a imagem ajustada no canvas
      profilePictureBlob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve)
      );
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", senha);

    // Se o usuário não tiver enviado uma foto, use a imagem padrão
    if (profilePictureBlob) {
      formData.append(
        "profilePicture",
        profilePictureBlob,
        "profilePicture.png"
      );
    } else {
      const defaultPictureBlob = await fetch(defaultProfilePicture).then(
        (res) => res.blob()
      );
      formData.append(
        "profilePicture",
        defaultPictureBlob,
        "defaultProfile.png"
      );
    }

    try {
      const res = await Cadastrar(formData);

      if (!res.ok) {
        throw new Error(`Erro ao cadastrar: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      const token = data.access_token;

      // Se necessário, salvar o token JWT nos cookies
      document.cookie = `token=${token}; path=/; max-age=86400`;

      router.push("/");
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
    }
    // } finally {
    //   const res = await Logar(email, senha);

    //   const data = await res.json();
    //   const token = data.access_token;

    //   // Salvando o token JWT nos cookies
    //   setCookie("token", token, 1); // Expira em 7 dias
    // }
    setLoading(false)
  };

  // Função para lidar com o upload de imagem
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicture(file);
    }
  };

  return {
    loginUser,
    setEmail,
    email,
    setSenha,
    senha,
    step,
    cadastrarUsuario,
    nextStep,
    setName,
    name,
    setConfirmarSenha,
    confirmarSenha,
    handleImageChange,
    profilePicture,
    editorRef,
    scale,
    setScale,
    previousStep,
    loading,
  };
};

export default useUser;
