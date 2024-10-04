"use client";

import { useState, useEffect, useRef } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import io from "socket.io-client";
import { BiMessageAdd, BiMessageDetail } from "react-icons/bi";
import { MdOutlineMailOutline } from "react-icons/md";
import { FaArrowLeft } from "react-icons/fa6";
import { FaCheck, FaRegTrashAlt } from "react-icons/fa";
import { GoPaperAirplane } from "react-icons/go";

const socket = io("http://localhost:3333");

interface Conversation {
  id: number;
  user1Id: number;
  user2Id: number;
  user1: {
    name: string;
    profilePicture: string;
  };
  user2: {
    name: string;
    profilePicture: string;
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
  profilePicture: string;
}

interface DecodedToken {
  exp: number;
  iat: number;
  sub: number;
  foto: string;
  username: string;
}

interface Invite {
  id: number;
  receiverId: number;
  senderId: number;
  status: string;
  receiver: {
    name: string;
    profilePicture: string;
  };
  sender: {
    name: string;
    profilePicture: string;
  };
}

const ChatPage = () => {
  const [userId, setUserId] = useState<number>(0);
  const [fotoPerfil, setfotoPerfil] = useState<string>("");
  const [nomeUser, setnomeUser] = useState<string>("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<
    number | null
  >(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [sentInvites, setSentInvites] = useState<Invite[]>([]);
  const [receivedInvites, setReceivedInvites] = useState<Invite[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [conversasModal, setconversasModal] = useState(true);
  const [addConversaModal, setaddConversaModal] = useState(false);
  const [convitesModal, setconvitesModal] = useState(false);
  const [perfilModal, setPerfilModal] = useState(false);
  const [modalAberto, setModalAberto] = useState("conversas");
  const [conversaAberta, setConversaAberta] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Função para buscar os convites (enviados e recebidos)
  const fetchInvites = async () => {
    const token = getCookie("token");
    try {
      const response = await fetch(
        `http://localhost:3333/invites/all/${userId}`,
        {
          method: "GET",
          headers: { authorization: `Bearer ${token}` },
          credentials: "include",
        }
      );
      const data = await response.json();
      setSentInvites(data.sentInvites);
      setReceivedInvites(data.receivedInvites);
    } catch (error) {
      console.error("Erro ao buscar convites:", error);
    }
  };

  // Enviar um convite
  const enviarConvite = async (recepId: number) => {
    const token = getCookie("token");
    try {
      const response = await fetch("http://localhost:3333/invites/send", {
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
  const aceitarConvite = async (invitationId: number, senderId: number) => {
    const token = getCookie("token");
    try {
      const response = await fetch(
        `http://localhost:3333/invites/accept/${invitationId}`,
        {
          method: "POST",
          headers: { authorization: `Bearer ${token}` },
          credentials: "include",
        }
      );

      CriarConversa(senderId);

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

  const recusarConvite = () => {};

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
          setfotoPerfil(decodedToken.foto);
          setnomeUser(decodedToken.username);
        }
      } else {
        console.log("Token não encontrado nos cookies");
      }
    };

    fetchAndDecodeToken();
  }, []);

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

  useEffect(() => {
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
    setConversaAberta(true)
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
      console.log(data);
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

  const CriarConversa = async (recepId: number) => {
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
            user1Id: userId, // Aqui você estava passando 'userId' em vez de 'senderId'
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
    fetchConversations();
    setconvitesModal(false);
    setPerfilModal(false);
  };

  const modalConversas = () => {
    return (
      <div className="text-white w-full pt-4  items-center">
        <div className="mb-4 flex flex-col pl-6 w-full">
          <h2 className="text-2xl font-bold mb-4">Conversas</h2>
          <input
            type="search"
            placeholder="Buscar suas conversas"
            className="w-[70%] sm:w-[95%] h-6 text-black p-4 border border-black rounded-[10px] outline-none"
          />
        </div>
  
        {conversations.length > 0 ? (
          <div className="mt-10">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                // Adiciona a classe de fundo escuro se a conversa estiver selecionada
                className={`${
                  selectedConversation === conversation.id
                    ? "bg-gray-400"
                    : "hover:bg-gray-200"
                } cursor-pointer font-bold p-1 text-[#122f42] flex w-[100%]`}
                onClick={() => selectConversation(conversation.id)}
              >
                <div className="flex items-center justify-between w-full p-1 sssm:p-2">
                  <div className="flex items-center gap-5">
                    <div className="flex border w-[60px] h-[60px] ml-0 border-black rounded-[100%] sm:ml-2">
                      <img
                        src={`http://localhost:3333/uploads/profile_pictures/${
                          conversation.user1Id === Number(userId)
                            ? conversation.user2.profilePicture
                            : conversation.user1.profilePicture
                        }`}
                        className="rounded-[100%] w-full h-full"
                        alt="Profile Picture"
                      />
                    </div>
                    <p className="text-2xl">
                      {`${
                        conversation.user1Id === Number(userId)
                          ? conversation.user2.name
                          : conversation.user1.name
                      }`}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="ml-6 mt-4">Você não possui conversas</div>
        )}
      </div>
    );
  };
  
  // className="cursor-pointer hover:bg-gray-200 p-2 rounded text-2xl"

  const showModalAddConversa = () => {
    setconversasModal(false);
    setaddConversaModal(true);
    fetchInvites();
    setModalAberto("addconversa");
    setconvitesModal(false);
    setPerfilModal(false);
  };

  const addConversas = () => {
    return (
      <div className="text-white w-full pt-4 pl-3 lg:pl-6">
        <div className="mb-4 flex flex-col w-full">
          <h2 className="text-2xl font-bold mb-4">Pesquisa</h2>
          <input
            type="search"
            placeholder="Buscar usuários"
            className="w-[70%] sm:w-[95%] h-6 p-4 text-black border border-black rounded-[10px] outline-none"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <div className="flex w-full">
          {showModal && (
            <div className="static w-[95%] rounded-[10px]  z-10">
              <h2 className="text-lg font-bold mb-4">Perfis</h2>
              <div className="flex flex-col">
                {filteredUsers
                  .filter((user) => user.id != userId)
                  .map((user) => (
                    <div
                      key={user.id}
                      className="hover:bg-gray-200 rounded-md font-bold text-[#122f42] flex  "
                    >
                      <div className="flex items-center justify-between w-full p-2">
                        <div className="flex items-center gap-3 lg:gap-5">
                          <div className="flex border border-black w-[40px] h-[40px] lg:w-[60px] lg:h-[60px] rounded-[100%] ml-2">
                            <img
                              src={`http://localhost:3333/uploads/profile_pictures/${user.profilePicture}`}
                              className="rounded-[100%]  w-full h-full"
                              alt="Profile Picture"
                            />
                          </div>
                          <p className="text-sm lg:text-xl">{user.name}</p>
                        </div>
                        {!sentInvites.some(
                          (invite) => invite.receiverId === user.id
                        ) && (
                          <button
                            onClick={() => enviarConvite(user.id)}
                            className="bg-[#7E57C2] text-white font-bold rounded-[10px] text-xs lg:text-sm p-2"
                          >
                            convidar
                          </button>
                        )}
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
    fetchInvites();
    setModalAberto("convites");
  };

  const convitesChat = () => {
    return (
      <div className="text-white w-full pt-4 pl-6">
        <div className="mb-4 flex flex-col w-full">
          <h2 className="text-2xl font-bold mb-4">Convites</h2>
        </div>
        <div className="flex flex-col w-[95%]">
          <div>
            <h2 className="text-xl font-bold mb-4">Enviados</h2>
            <div className="mt-5">
              {sentInvites.length > 0 ? (
                sentInvites.map((invite) => (
                  <div key={invite.id} className="flex flex-col w-full">
                    <div className="w-full flex items-center sm:flex-col sm:items-start justify-between pr-2 pb-2 md:items-center md:flex-row">
                      <div className="flex items-center gap-2">
                        <div className="flex w-[50px] h-[50px] border border-black rounded-[100%] ">
                          <img
                            src={`http://localhost:3333/uploads/profile_pictures/${invite.receiver.profilePicture}`}
                            className="rounded-[100%]  w-full h-full"
                            alt="Profile Picture"
                          />
                        </div>
                        <p className="font-bold text-[#122f42]">
                          {invite.receiver.name}
                        </p>
                      </div>
                      <p className="bg-gray-200 text-xs p-1 mt-2 text-black rounded-[10px] md:mt-0">
                        {invite.status}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-black sm:text-base">
                  Você não enviou nenhum convite.
                </p>
              )}
            </div>
          </div>
          <div>
            <h2 className="text-sm font-bold mt-6">Recebidos</h2>
            <div className="mt-5">
              {receivedInvites.length > 0 ? (
                receivedInvites.map((invite) => (
                  <div key={invite.id} className="flex flex-col w-full">
                    <div className="w-full flex items-center sm:flex-col sm:items-start justify-between pr-2 pb-2 lg:flex-row lg:items-center">
                      <div className="flex items-center gap-2 ">
                        <div className="flex w-[50px] h-[50px] border border-black rounded-[100%] ">
                          <img
                            src={`http://localhost:3333/uploads/profile_pictures/${invite.sender.profilePicture}`}
                            className="rounded-[100%]  w-full h-full"
                            alt="Profile Picture"
                          />
                        </div>
                        <p className="font-bold text-[#122f42]">
                          {invite.sender.name}
                        </p>
                      </div>
                      <div className="flex gap-2 items-center justify-center sm:mt-2 lg:mt-0">
                        <p className="bg-gray-200 text-xs p-1 text-black rounded-[10px]">
                          {invite.status}
                        </p>
                        {invite.status == "PENDING" && (
                          <div className=" flex gap-2">
                            <button
                              onClick={() =>
                                aceitarConvite(invite.id, invite.senderId)
                              }
                              className="bg-[#2da555] text-white font-bold w-[30px] h-[30px] flex items-center justify-center rounded-[10px] text-sm p-2"
                            >
                              <FaCheck className="text-xl" />
                            </button>
                            <button
                              onClick={() => recusarConvite()}
                              className="bg-[#df3c3c] text-white font-bold w-[30px] h-[30px] flex items-center justify-center rounded-[10px] text-sm p-2"
                            >
                              <FaRegTrashAlt className="text-xl" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-black sm:text-base">
                  Você não recebeu nenhum convite.
                </p>
              )}
            </div>
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
    return (
      <div className="text-white w-full pt-4 pl-6">
        <div className="mb-4 flex flex-col w-full">
          <h2 className="text-2xl font-bold mb-4">Perfil</h2>
        </div>
        <div className="flex flex-col w-full items-center justify-center mt-7">
          <div className="w-[100px] h-[100px] lg:w-[200px] lg:h-[200px]">
            <img
              src={`http://localhost:3333/uploads/profile_pictures/${fotoPerfil}`}
              className="rounded-[100%]  w-full h-full"
              alt="Profile Picture"
            />
          </div>
          <p className="text-3xl mt-6">{nomeUser}</p>
        </div>
      </div>
    );
  };

  const fecharConversa = () => {
    setSelectedConversation(null);
  };

  return (
    <main className="w-screen h-screen relative">
      <div className="flex w-screen h-screen">
        <div className="w-screen h-full fixed bg-[#4180ab] flex sm:static sm:w-2/5 sm:h-auto">
          <div className="fixed flex items-center justify-center bottom-0 w-screen gap-5 h-[70px] bg-[#8ab3cf]  sm:static sm:h-auto sm:bottom-auto sm:w-[80px] sm:flex-col sm:items-center sm:justify-between sm:gap-0">
            <div className="flex sm:block gap-5 sm:gap-0">
              <div
                className={`mt-0 sm:mt-5  p-2 rounded-[100%] flex ${
                  modalAberto === "conversas" ? "bg-white/50" : "bg-transparent"
                } `}
              >
                <button onClick={showModalConversas}>
                  <BiMessageDetail className="text-3xl" />
                </button>
              </div>
              <div
                className={`mt-0 sm:mt-5  p-2 rounded-[100%] flex ${
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
                className={`mt-0 sm:mt-5  p-2 rounded-[100%] flex ${
                  modalAberto === "convites" ? "bg-white/50" : "bg-transparent"
                } `}
              >
                <button onClick={showModalConvites}>
                  <MdOutlineMailOutline className="text-3xl " />
                </button>
              </div>
            </div>
            <div className="mb-0 sm:mb-5 ">
              <div
                className={`mt-0 sm:mt-5  p-1 rounded-[100%] flex ${
                  modalAberto === "perfil" ? "bg-white/50" : "bg-transparent"
                } `}
              >
                <button
                  className="w-[40px] h-[40px] sm:w-[50px] sm:h-[50px]"
                  onClick={showModalPerfil}
                >
                  <img
                    src={`http://localhost:3333/uploads/profile_pictures/${fotoPerfil}`}
                    className="rounded-[100%]  w-full h-full"
                    alt="Profile Picture"
                  />
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

        <div className="w-3/4 h-screen flex flex-col shadow-lg">
          {selectedConversation ? (
            <div className="fixed w-screen flex flex-col h-full border-l border-black bg-[#8ab3cf] sm:static sm:w-auto">
              <div className="overflow-y-auto h-[90%] border-b border-black">
                <div className="fixed flex top-0 bg-[#4180ab] w-full h-[60px] items-center justify-start pl-2">
                  <button
                    className="block sm:hidden"
                    onClick={() => fecharConversa()}
                  >
                    <FaArrowLeft className="text-xl" />
                  </button>
                  {conversations.filter((conversa) => conversa.id == selectedConversation).map((conversation) => (
                    <div
                      className="cursor-pointer font-bold text-[#122f42] flex"
                    >
                        <div className="ml-2 flex items-center gap-4">
                            <img
                              src={`http://localhost:3333/uploads/profile_pictures/${
                                conversation.user1Id === Number(userId)
                                  ? conversation.user2.profilePicture
                                  : conversation.user1.profilePicture
                              }`}
                              className="rounded-[100%]  w-[40px] h-[40px]"
                              alt="Profile Picture"
                            />
                          <p className="text-xl">
                            {" "}
                            {`${
                              conversation.user1Id === Number(userId)
                                ? `${conversation.user2.name} `
                                : ` ${conversation.user1.name}`
                            }`}
                          </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4">
                  <ul className="mt-20 space-y-2 flex flex-col">
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
              </div>
              <div className="flex h-[10%] w-full">
                <input
                  type="text"
                  placeholder="Digite sua mensagem..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="w-full p-2 border rounded-l-md outline-none "
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-blue-500 text-white p-2 rounded-r-md w-[60px] flex items-center justify-center "
                >
                  <GoPaperAirplane className="text-3xl" />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-[#8ab3cf] h-full">
              Clique em uma conversa para abir
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default ChatPage;
