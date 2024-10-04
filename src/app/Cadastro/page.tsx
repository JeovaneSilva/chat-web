"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import AvatarEditor from "react-avatar-editor";

// Defina uma imagem padrão para os usuários que não enviarem uma foto
const defaultProfilePicture = "/assets/defaultProfile.png";

const Cadastro = () => {
  const [step, setStep] = useState(1); // Controla as etapas
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null); // Imagem selecionada pelo usuário
  const [scale, setScale] = useState<number>(1); // Estado para o zoom da imagem
  const editorRef = useRef<AvatarEditor>(null);
  const router = useRouter();

  const setCookie = (name: string, value: string, days: number) => {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(
      value
    )}; expires=${expires}; path=/`;
  };

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
      const res = await fetch("http://localhost:3333/users", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Erro ao cadastrar: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      const token = data.access_token;

      // Se necessário, salvar o token JWT nos cookies
      document.cookie = `token=${token}; path=/; max-age=86400`;

      router.push("/chat");
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
    } finally {
        const res = await fetch("http://localhost:3333/auth/login", {
          method: "POST",
          body: JSON.stringify({
            email: email,
            password: senha,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();
        const token = data.access_token;

        // Salvando o token JWT nos cookies
        setCookie("token", token, 1); // Expira em 7 dias
    }
  };

  // Função para lidar com o upload de imagem
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicture(file);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-900">
      <section className="bg-gray-800 p-8 rounded-lg shadow-md w-[350px] max-w-sm">
        <h2 className="text-xl font-bold text-[#7E57C2] text-center mb-8">
          CADASTRO - ETAPA {step} de 3
        </h2>
        <form onSubmit={step === 3 ? cadastrarUsuario : nextStep}>
          {/* Etapa 1: Nome e Email */}
          {step === 1 && (
            <div>
              <div className="mb-4">
                <label className="block text-[#7E57C2] mb-2">Nome</label>
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
                <label className="block text-[#7E57C2] mb-2">Email</label>
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
              <div className="mb-4">
                <label className="block text-[#7E57C2] mb-2">Senha</label>
                <input
                  type="password"
                  placeholder="Senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-[#7E57C2] mb-2">
                  Confirmar Senha
                </label>
                <input
                  type="password"
                  placeholder="Confirmar Senha"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                  required
                />
              </div>
            </div>
          )}

          {/* Etapa 3: Foto de Perfil (Opcional) */}
          {step === 3 && (
            <div>
              <div className="mb-6 text-center">
                <label className="block text-[#7E57C2] mb-2">
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
                      width: "200px", // Largura reduzida
                      height: "200px", // Altura reduzida
                      border: "10px solid rgba(255, 255, 255, 0.5)", // Borda semi-transparente
                      borderRadius: "50%", // Borda redonda
                      boxShadow: "0 0 8px rgba(0, 0, 0, 0.5)",
                      background: "rgba(0, 0, 0, 0.5)", // Fundo escuro e semi-transparente
                    }}
                  >
                    <AvatarEditor
                      ref={editorRef}
                      image={profilePicture}
                      width={200} // Largura ajustada
                      height={200} // Altura ajustada
                      border={50}
                      borderRadius={100} // Mantém o formato redondo
                      color={[255, 255, 255, 0.6]} // Cor de fundo
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
              className="bg-[#7E57C2] hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
            >
              {step === 3 ? "Finalizar Cadastro" : "Próxima Etapa"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default Cadastro;
