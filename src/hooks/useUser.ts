import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { decodeToken, setCookie } from "@/utils/token";
import { Cadastrar, Logar } from "@/services/userService";
import AvatarEditor from "react-avatar-editor";
import Cookies from "js-cookie";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { useUserContext } from "@/context/UserContext";

const defaultProfilePicture = "/assets/defaultProfile.png";

const useUser = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [scale, setScale] = useState<number>(1);
  const editorRef = useRef<AvatarEditor>(null);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { setNomeUser, setFotoPerfil,setUserId } = useUserContext();

  //  LOGIN
  const loginUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
  
    try {
      if (!email || !senha) {
        throw new Error("Preencha todos os campos.");
      }
  
      const res = await Logar(email, senha);
  
      if (!res.ok) {
        throw new Error("Email ou senha inválidos.");
      }
  
      const data = await res.json();
      const token = await data.access_token;
      console.log("token login", token)
  
      setCookie("token", token, 1);
  
      if (token) {
        // Decodifica e atualiza o contexto global
        const decodedToken = decodeToken(token);
        if (decodedToken) {
          setUserId(decodedToken.sub)
          setNomeUser(decodedToken.username);
          setFotoPerfil(decodedToken.foto);
        }
  
        router.push("/chat");
      } else {
        throw new Error("Token de acesso não encontrado.");
      }
    } catch (error) {
      setErrorMessage("Erro ao autenticar.");
    }
    setLoading(false);
  };

  //   CADASTRO
  // Função para avançar as etapas
  const nextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (senha !== confirmarSenha) {
        alert("As senhas não coincidem!");
        return;
      }
      setStep(3);
    }
  };

  const previousStep = () => {
    if (step > 1) setStep(step - 1);
  };

  // Função para enviar os dados de cadastro
  const cadastrarUsuario = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let profilePictureBlob: Blob | null = null;
    if (editorRef.current) {
      const canvas = editorRef.current.getImage();
      profilePictureBlob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve)
      );
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", senha);

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
        alert("deu erro");
        throw new Error(`Erro ao cadastrar: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      const token = data.access_token;

      document.cookie = `token=${token}; path=/; max-age=86400`;

      router.push("/");
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
    }
    setLoading(false);
  };

  // Função para lidar com o upload de imagem
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicture(file);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };


  useEffect(() => {
    const checkToken = async () => {
      const token = Cookies.get("token");

      if (token) {
        try {
          const decoded = jwtDecode<JwtPayload>(token);

          // Verifica se o token está expirado
          if (decoded.exp && decoded.exp * 1000 > Date.now()) {
            router.push("/chat"); // Token válido
          } else {
            console.warn("Token expirado.");
            Cookies.remove("token"); // Remove o token expirado
          }
        } catch (error) {
          console.error("Erro ao decodificar token:", error);
          Cookies.remove("token");
        }
      }
    };

    checkToken();
  }, [router]);

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
    setProfilePicture,
    editorRef,
    scale,
    setScale,
    previousStep,
    loading,
    togglePasswordVisibility,
    showPassword,
    toggleConfirmPasswordVisibility,
    showConfirmPassword,
    errorMessage
  };
};

export default useUser;
