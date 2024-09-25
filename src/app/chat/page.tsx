"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Image from "next/image";
import imagechat from "../../assets/imagechat.png";
import io from "socket.io-client";

const socket = io("http://localhost:3333");

interface Conversation {
  id: number;
  user1Id: number;
  user2Id: number;
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
  const [showModal, setShowModal] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

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

  return (
    <main className="w-screen h-screen relative">
      {conversations.length > 0 ? (
        <div className="flex w-screen h-screen">
          <div className="w-1/4 p-4 bg-gray-100">
            <div>
              <div className="mb-4">
                <h2 className="text-xl font-bold mb-4">Conversas</h2>
                <input
                  type="search"
                  placeholder="Buscar usuários"
                  className="w-4/5 h-6 p-4 border-2 border-black rounded-[18px] outline-none"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
              <ul>
                {conversations.map((conversation) => (
                  <li
                    key={conversation.id}
                    onClick={() => selectConversation(conversation.id)}
                    className="cursor-pointer hover:bg-gray-200 p-2 rounded"
                  >
                    {`Conversa com ${
                      conversation.user1Id === Number(userId)
                        ? `Usuário ${conversation.user2Id}`
                        : `Usuário ${conversation.user1Id}`
                    }`}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              {showModal && (
                <div className="absolute left-0 w-1/5 ml-4 rounded-[10px] top-[10px] mt-24 bg-white  p-4 z-10">
                  <h2 className="text-lg font-bold mb-4">
                    Resultados da Busca
                  </h2>
                  <ul className="flex flex-col gap-1">
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
                </div>
              )}
            </div>
          </div>

          <div className="w-3/4 h-screen flex flex-col bg-white p-4 shadow-lg">
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
              <div>Clique em uam conversa para abir</div>
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
