import { useState, useEffect, useRef } from "react";
import { Conversation, Message } from "@/types/Chat";
import { User, DecodedToken } from "@/types/User";
import { Invite } from "@/types/Invites";
import { jwtDecode } from "jwt-decode";
import io from "socket.io-client";
import {
  AcceptConvite,
  BuscarConversa,
  BuscarConvites,
  CriarConverse,
  EnviarConvite,
  SelecionarConversa,
} from "@/services/chatService";
import { BuscarUsuarios } from "@/services/userService";

const socket = io("http://localhost:3333");

const useChat = () => {
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
  const [modalConvite, setmodalConvite] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

   const getCookie = (name: string): string | null => {
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${name}=`));
    return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
  };

  const token = getCookie("token");
  // Função para buscar os convites (enviados e recebidos)
  const fetchInvites = async () => {
    try {
      const data = await BuscarConvites(userId);
      setSentInvites(data.sentInvites);
      setReceivedInvites(data.receivedInvites);
    } catch (error) {
      console.error("Erro ao buscar convites:", error);
    }
  };

  // Enviar um convite
  const enviarConvite = async (recepId: number) => {
    try {
      const data = await EnviarConvite(recepId, userId);
      if (data.ok) {
        setmodalConvite(true);
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
    try {
      const data = await AcceptConvite(invitationId);

      CriarConversa(senderId);

      if (data.ok) {
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
    try {
      const data = await BuscarConversa(userId);
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
    try {
      const data = await SelecionarConversa(conversationId);
      if (!data.ok) {
        throw new Error(`HTTP error! Status: ${data.status}`);
      }
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
    try {
      
      const data = await BuscarUsuarios();
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
    try {
      const data = await CriarConverse(userId, recepId);

      if (!data.ok) {
        throw new Error(`Erro HTTP! Status: ${data.status}`);
      }
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

  const showModalAddConversa = () => {
    setconversasModal(false);
    setaddConversaModal(true);
    fetchInvites();
    setModalAberto("addconversa");
    setconvitesModal(false);
    setPerfilModal(false);
  };

  const showModalConvites = () => {
    setconversasModal(false);
    setaddConversaModal(false);
    setconvitesModal(true);
    setPerfilModal(false);
    fetchInvites();
    setModalAberto("convites");
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

  const fecharConversa = () => {
    setSelectedConversation(null);
  };

  return {
    conversations,
    selectedConversation,
    selectConversation,
    userId,
    searchQuery,
    handleSearch,
    showModal,
    filteredUsers,
    sentInvites,
    enviarConvite,
    modalConvite,
    receivedInvites,
    aceitarConvite,
    recusarConvite,
    fotoPerfil,
    nomeUser,
    modalAberto,
    showModalConversas,
    showModalAddConversa,
    showModalConvites,
    showModalPerfil,
    conversasModal,
    addConversaModal,
    convitesModal,
    perfilModal,
    fecharConversa,
    messages,
    messagesEndRef,
    newMessage,
    setNewMessage,
    handleSendMessage,
  };
};

export default useChat;
