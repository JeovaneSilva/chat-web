"use client";

import { useState, useEffect, useRef } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Image from "next/image";
import imagechat from "../../assets/imagechat.png";
import io from "socket.io-client";
import { BiMessageAdd, BiMessageDetail } from "react-icons/bi";
import { MdOutlineMailOutline } from "react-icons/md";
import { FaRegCircleUser } from "react-icons/fa6";
import imagemlogin from "@/assets/imagemlogin.png";

const socket = io("http://localhost:3333");

interface Conversation {
  id: number;
  user1Id: number;
  user2Id: number;
  user2: {
    name: string;
  };
}

interface Message {
  id: number;
  content: string;
  senderId: number;
  conversationId: number;
}

interface User {
  id: number;
  name: string;
}

interface DecodedToken {
  exp: number;
  iat: number;
  sub: number;
}

const ChatPage = () => {
  const [userId, setUserId] = useState<number>(0);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<
    number | null
  >(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [sentInvites, setSentInvites] = useState<User[]>([]);
  const [receivedInvites, setReceivedInvites] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [conversasModal, setconversasModal] = useState(true);
  const [addConversaModal, setaddConversaModal] = useState(false);
  const [convitesModal, setconvitesModal] = useState(false);
  const [perfilModal, setPerfilModal] = useState(false);
  const [modalAberto, setModalAberto] = useState("conversas");

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Função para buscar os convites (enviados e recebidos)
  const fetchInvites = async () => {
    const token = getCookie("token");
    try {
      const response = await fetch(`http://localhost:3333/convites`, {
        method: "GET",
        headers: { authorization: `Bearer ${token}` },
        credentials: "include",
      });
      const data = await response.json();
      setSentInvites(data.sent);
      setReceivedInvites(data.received);
    } catch (error) {
      console.error("Erro ao buscar convites:", error);
    }
  };

  // Enviar um convite
  const enviarConvite = async (recepId: number) => {
    const token = getCookie("token");
    try {
      const response = await fetch("http://localhost:3333/convites/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ senderId: userId, receiverId: recepId }),
        credentials: "include",
      });
      if (response.ok) {
        alert("Convite enviado com sucesso!");
        fetchInvites(); // Atualiza a lista de convites
      } else {
        console.error("Erro ao enviar convite");
      }
    } catch (error) {
      console.error("Erro ao enviar convite:", error);
    }
  };

  // Aceitar um convite
  const aceitarConvite = async (invitationId: number) => {
    const token = getCookie("token");
    try {
      const response = await fetch(
        `http://localhost:3333/convites/accept/${invitationId}`,
        {
          method: "POST",
          headers: { authorization: `Bearer ${token}` },
          credentials: "include",
        }
      );
      if (response.ok) {
        alert("Convite aceito com sucesso!");
        fetchInvites(); // Atualiza a lista de convites
      } else {
        console.error("Erro ao aceitar convite");
      }
    } catch (error) {
      console.error("Erro ao aceitar convite:", error);
    }
  };

  const getCookie = (name: string): string | null => {
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${name}=`));
    return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
  };

  const decodeToken = (token: string): DecodedToken | null => {
    try {
      const decoded: DecodedToken = jwtDecode(token);
      return decoded;
    } catch (error) {
      console.error("Erro ao decodificar o token JWT:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchAndDecodeToken = () => {
      const token = getCookie("token");
      if (token) {
        const decodedToken = decodeToken(token);
        if (decodedToken) {
          setUserId(decodedToken.sub);
          console.log("Token JWT decodificado:", decodedToken);
          console.log("ID do usuário autenticado:", decodedToken.sub);
        }
      } else {
        console.log("Token não encontrado nos cookies");
      }
    };

    fetchAndDecodeToken();
  }, []);

  useEffect(() => {
    const fetchConversations = async () => {
      const token = getCookie("token");
      try {
        const response = await fetch(
          `http://localhost:3333/conversations/user?userId=${userId}`,
          {
            method: "GET",
            headers: { authorization: `Bearer ${token}` },
            credentials: "include",
          }
        );
        const data = await response.json();
        setConversations(data);
      } catch (error) {
        console.error("Erro ao buscar conversas:", error);
        setConversations([]);
      }
    };

    if (userId) {
      fetchConversations();
    }
  }, [userId]);

  useEffect(() => {
    socket.on("message", (message: Message) => {
      if (selectedConversation === message.conversationId) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });

    return () => {
      socket.off("message");
    };
  }, [selectedConversation]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "instant" });
    }
  }, [messages]);

  const selectConversation = async (conversationId: number) => {
    setSelectedConversation(conversationId);
    const token = getCookie("token");
    try {
      const response = await fetch(
        `http://localhost:3333/messages/conversation?conversationId=${conversationId}`,
        {
          method: "GET",
          headers: { authorization: `Bearer ${token}` },
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao buscar mensagens:", error);
      setMessages([]);
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === "" || selectedConversation === null) return;

    socket.emit("sendMessage", {
      content: newMessage,
      senderId: Number(userId),
      conversationId: selectedConversation,
    });

    setNewMessage("");
  };

  // Função para carregar todos os usuários uma única vez
  const fetchAllUsers = async () => {
    const token = getCookie("token");
    try {
      const response = await fetch("http://localhost:3333/users", {
        method: "GET",
        headers: { authorization: `Bearer ${token}` },
        credentials: "include",
      });
      const data = await response.json();
      setAllUsers(data);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  // Função de filtragem local com base na pesquisa
  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query.trim() !== "") {
      const filtered = allUsers.filter((user) =>
        user.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredUsers(filtered);
      setShowModal(true); // Exibe o modal quando a pesquisa é feita
    } else {
      setFilteredUsers([]);
      setShowModal(false); // Esconde o modal se a pesquisa for apagada
    }
  };

  const CriarConversa = async (senderId: number, recepId: number) => {
    const token = getCookie("token");
    try {
      const response = await fetch(
        "http://localhost:3333/conversations/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Adicionando o Content-Type
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            user1Id: senderId, // Aqui você estava passando 'userId' em vez de 'senderId'
            user2Id: recepId,
          }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`Erro HTTP! Status: ${response.status}`);
      }

      const data = await response.json();
      setAllUsers(data); // Certifique-se de que o que está retornando é a lista de usuários.
      alert("criada");
    } catch (error) {
      console.error("Erro ao criar a conversa:", error);
    }
  };

  const showModalConversas = () => {
    setconversasModal(true);
    setModalAberto("conversas");
    setaddConversaModal(false);
    setconvitesModal(false);
    setPerfilModal(false);
  };

  const modalConversas = () => {
    return (
      <div className="text-white w-full pt-4 pl-6 items-center">
        <div className="mb-4 flex flex-col w-full">
          <h2 className="text-2xl font-bold mb-4">Conversas</h2>
          <input
            type="search"
            placeholder="Buscar suas conversas"
            className="w-[95%] h-6 text-black p-4 border border-black rounded-[10px] outline-none"
          />
        </div>
        <div className="mt-10">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className="hover:bg-gray-200 cursor-pointer font-bold text-[#122f42] flex items-end flex-col w-[95%]"
              onClick={() => selectConversation(conversation.id)}
            >
              <hr className="w-4/5 mb-2 " />
              <div className="flex items-center justify-between w-full pr-2 pb-2">
                <div className="flex items-center gap-5">
                  <div className="flex p-1 border border-black rounded-[100%] ml-2">
                    <Image
                      src={imagechat}
                      alt="Astronaut Cat"
                      width={50}
                      height={50}
                    />
                  </div>
                  <p className="text-2xl">
                    {" "}
                    {`${
                      conversation.user1Id === Number(userId)
                        ? `${conversation.user2.name} `
                        : ` ${conversation.user1Id}`
                    }`}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  // className="cursor-pointer hover:bg-gray-200 p-2 rounded text-2xl"

  const showModalAddConversa = () => {
    setconversasModal(false);
    setaddConversaModal(true);
    setModalAberto("addconversa");
    setconvitesModal(false);
    setPerfilModal(false);
  };

  const addConversas = () => {
    return (
      <div className="text-white w-full pt-4 pl-6">
        <div className="mb-4 flex flex-col w-full">
          <h2 className="text-2xl font-bold mb-4">Pesquisa</h2>
          <input
            type="search"
            placeholder="Buscar usuários"
            className="w-[95%] h-6 p-4 text-black border border-black rounded-[10px] outline-none"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <div className="flex w-full">
          {showModal && (
            <div className="static w-[95%] rounded-[10px]  z-10">
              <h2 className="text-lg font-bold mb-4">Perfis</h2>
              <div className="flex flex-col">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="hover:bg-gray-200 font-bold text-[#122f42] flex items-end flex-col "
                  >
                    <hr className="w-4/5 mb-2 " />
                    <div className="flex items-center justify-between w-full pr-2 pb-2">
                      <div className="flex items-center gap-5">
                        <div className="flex p-1 border border-black rounded-[100%] ml-2">
                          <Image
                            src={imagechat}
                            alt="Astronaut Cat"
                            width={50}
                            height={50}
                          />
                        </div>
                        <p className="text-xl">{user.name}</p>
                      </div>
                      <button
                        onClick={() => CriarConversa(userId, user.id)}
                        className="bg-[#7E57C2] text-white font-bold rounded-[10px] text-sm p-2"
                      >
                        convidar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const showModalConvites = () => {
    setconversasModal(false);
    setaddConversaModal(false);
    setconvitesModal(true);
    setPerfilModal(false);
    setModalAberto("convites");
  };

  const convitesChat = () => {
    return (
      <div className="text-white w-full pt-4 pl-6">
        <div>
          <h2 className="text-2xl font-bold mb-4">Convites Enviados</h2>
          <div className="mt-10">
            {Array.isArray(sentInvites) && sentInvites.length > 0 ? (
              sentInvites.map((invite) => (
                <div key={invite.id} className="font-bold text-[#122f42]">
                  Convite enviado para {invite.name}
                </div>
              ))
            ) : (
              <p>Você não enviou nenhum convite.</p>
            )}
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold mt-6">Convites Recebidos</h2>
          <div className="mt-10">
            {receivedInvites.length > 0 ? (
              receivedInvites.map((invite) => (
                <div
                  key={invite.id}
                  className="flex items-center justify-between"
                >
                  <p className="font-bold text-[#122f42]">
                    Convite de {invite.name}
                  </p>
                  <button
                    onClick={() => aceitarConvite(invite.id)}
                    className="bg-[#7E57C2] text-white font-bold rounded-[10px] text-sm p-2"
                  >
                    Aceitar
                  </button>
                </div>
              ))
            ) : (
              <p>Você não recebeu nenhum convite.</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Chamando as funções
  useEffect(() => {
    fetchInvites(); // Busca os convites enviados e recebidos ao carregar a página
  }, [userId]);

  const showModalPerfil = () => {
    setconversasModal(false);
    setaddConversaModal(false);
    setconvitesModal(false);
    setPerfilModal(true);
    setModalAberto("perfil");
  };

  const perfil = () => {
    return <div>perfil</div>;
  };

  

  return (
    <main className="w-screen h-screen relative">
      {conversations.length > 0 ? (
        <div className="flex w-screen h-screen">
          <div className="w-2/5 bg-[#4180ab] flex ">
            <div className="w-[80px] bg-[#8ab3cf] flex flex-col items-center justify-between">
              <div>
                <div
                  className={`mt-5  p-2 rounded-[100%] flex ${
                    modalAberto === "conversas"
                      ? "bg-white/50"
                      : "bg-transparent"
                  } `}
                >
                  <button onClick={showModalConversas}>
                    <BiMessageDetail className="text-3xl" />
                  </button>
                </div>
                <div
                  className={`mt-5  p-2 rounded-[100%] flex ${
                    modalAberto === "addconversa"
                      ? "bg-white/50"
                      : "bg-transparent"
                  } `}
                >
                  <button onClick={showModalAddConversa}>
                    <BiMessageAdd className="text-3xl" />
                  </button>
                </div>

                <div
                  className={`mt-5  p-2 rounded-[100%] flex ${
                    modalAberto === "convites"
                      ? "bg-white/50"
                      : "bg-transparent"
                  } `}
                >
                  <button onClick={showModalConvites}>
                    <MdOutlineMailOutline className="text-3xl " />
                  </button>
                </div>
              </div>
              <div className="mb-5">
                <div
                  className={`mt-5  p-2 rounded-[100%] flex ${
                    modalAberto === "perfil" ? "bg-white/50" : "bg-transparent"
                  } `}
                >
                  <button onClick={showModalPerfil}>
                    <FaRegCircleUser className="text-3xl " />
                  </button>
                </div>
              </div>
            </div>
            <div className="w-full">
              {conversasModal && modalConversas()}
              {addConversaModal && addConversas()}
              {convitesModal && convitesChat()}
              {perfilModal && perfil()}
            </div>
          </div>

          <div className="w-3/4 h-screen flex flex-col bg-[#8ab3cf] p-4 shadow-lg">
            {selectedConversation ? (
              <>
                <div className="h-full overflow-y-auto p-4 mb-4 rounded-md border">
                  <ul className="space-y-2 flex flex-col">
                    {messages.map((message) => (
                      <li
                        key={message.id}
                        className={`p-2 flex flex-col rounded-md w-[200px] ${
                          message.senderId === Number(userId)
                            ? "bg-blue-100 text-blue-800 items-end self-end"
                            : "bg-gray-200 text-gray-800 items-start self-start"
                        }`}
                      >
                        <span className="block font-semibold">
                          {`Usuário ${message.senderId} diz:`}
                        </span>
                        <p>{message.content}</p>
                      </li>
                    ))}
                    <div ref={messagesEndRef} />{" "}
                  </ul>
                </div>
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Digite sua mensagem..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="w-full p-2 border rounded-l-md"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="bg-blue-500 text-white p-2 rounded-r-md"
                  >
                    Enviar
                  </button>
                </div>
              </>
            ) : (
              <div>Clique em uma conversa para abir</div>
            )}
          </div>
        </div>
      ) : (
        <section className="flex flex-col w-screen h-screen items-center justify-center gap-3">
          <div>
            <input
              className="border-2 border-black"
              type="search"
              placeholder="Buscar usuários"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)} // Lógica de busca
            />
          </div>
          <Image
            className="mt-10 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] sm:mt-2"
            src={imagechat}
            alt="Astronaut Cat"
          />
          <p className="text-sm max-w-[260px] text-center font-bold sm:text-lg sm:max-w-[370px]">
            Você não possui nenhuma conversa, busque por usuários!
          </p>
          {filteredUsers.length > 0 && (
            <ul className="w-64 mt-4 border border-gray-300 p-4 rounded-lg bg-white">
              {filteredUsers.map((user) => (
                <li
                  key={user.id}
                  className="p-2 hover:bg-gray-200 flex items-center justify-between"
                >
                  {user.name}
                  <button
                    onClick={() => CriarConversa(userId, user.id)}
                    className="bg-[#7E57C2] text-white font-bold rounded-[10px] text-sm p-2"
                  >
                    Conversar
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </main>
  );
};

export default ChatPage;
