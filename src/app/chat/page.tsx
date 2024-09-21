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
interface DecodedToken {
  exp: number;
  iat: number;
  sub: number;
}

const ChatPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userId, setUserId] = useState<number>(0);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<
    number | null
  >(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

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
      const token = getCookie("token"); // Busca o token do cookie
      if (token) {
        const decodedToken = decodeToken(token); // Decodifica o token
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
    // Rolar para o fim da lista de mensagens quando `messages` mudar
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
      if (Array.isArray(data)) {
        setMessages(data);
      } else {
        console.error("Dados de mensagens não são um array:", data);
        setMessages([]);
      }
      console.log("teste");
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

  return (
    <main>
      {conversations.length > 0 ? (
        <div className="flex">
          <div className="w-1/4 p-4 bg-gray-100">
            <h2 className="text-xl font-bold mb-4">Conversas</h2>
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

          <div className="w-3/4 flex flex-col bg-white p-4 shadow-lg">
            {selectedConversation ? (
              <>
                <div className="h-96 overflow-y-auto p-4 mb-4 rounded-md border">
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
                    {/* Ref para rolar para o fim */}
                  </ul>
                </div>
                <div className="flex">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 p-2 border rounded"
                    placeholder="Digite uma mensagem"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="ml-2 p-2 bg-blue-500 text-white rounded"
                  >
                    Enviar
                  </button>
                </div>
              </>
            ) : (
              <p>Selecione uma conversa para ver as mensagens.</p>
            )}
          </div>
        </div>
      ) : (
        <section className="flex flex-col w-scren h-screen items-center justify-center gap-3">
          <div>
            <input className="border-2 border-black" type="search" name="" id="" />
          </div>
          <Image className="mt-10 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] sm:mt-2" src={imagechat} alt="Astronaut Cat" />
          <p className="text-sm max-w-[260px] text-center font-bold sm:text-lg sm:max-w-[370px]">voce não possui nenhuma conversa, busque por usuários!</p>
        </section>
      )}
    </main>
  );
};

export default ChatPage;
