import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Conversation, Message } from "@/types/Chat";
import { User } from "@/types/User";
import { Invite } from "@/types/Invites";
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
import { decodeToken } from "@/utils/token";
import { getCookie } from "@/utils/token";
import {
  conversationCreatedErro,
  conversationCreatedOk,
  invitationAcceptedErro,
  invitationAcceptedOk,
  invitationSentError,
  invitationSentOk,
} from "@/utils/toastify";

const socket = io("http://localhost:3333");

const useChat = () => {
  const router = useRouter();

  // Estados relacionados ao usuário
  const [userId, setUserId] = useState<number>(0);
  const [fotoPerfil, setfotoPerfil] = useState<string>("");
  const [nomeUser, setnomeUser] = useState<string>("");

  // Estados relacionados às conversas e mensagens
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<
    number | null
  >(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");

  // Estados relacionados à pesquisa e convites
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [sentInvites, setSentInvites] = useState<Invite[]>([]);
  const [receivedInvites, setReceivedInvites] = useState<Invite[]>([]);

  // Estados relacionados aos modais
  const [showModal, setShowModal] = useState<boolean>(false);
  const [conversasModal, setconversasModal] = useState<boolean>(true);
  const [addConversaModal, setaddConversaModal] = useState<boolean>(false);
  const [convitesModal, setconvitesModal] = useState<boolean>(false);
  const [perfilModal, setPerfilModal] = useState<boolean>(false);
  const [modalAberto, setModalAberto] = useState<string>("conversas");
  const [modalAcceptAndRemove, setModalAcceptAndRemove] =
    useState<boolean>(false);

  // Outros estados e referências
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const token = getCookie("token");

  /* ------------------ useEffects ------------------ */

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

  useEffect(() => {
    fetchAllUsers();
  }, []);

  useEffect(() => {
    fetchInvites();
  }, [userId]);

  // ############## Funções de Conversas #################

  const fetchConversations = async () => {
    try {
      const data = await BuscarConversa(userId);
      setConversations(data);
    } catch (error) {
      console.error("Erro ao buscar conversas:", error);
      setConversations([]);
    }
  };

  const selectConversation = async (conversationId: number) => {
    setSelectedConversation(conversationId);
    try {
      const res = await SelecionarConversa(conversationId);
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      const data = await res.json();
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

  const CriarConversa = async (recepId: number) => {
    try {
      const res = await CriarConverse(userId, recepId);

      if (res.ok) {
        conversationCreatedOk();
      } else {
        conversationCreatedErro();
        throw new Error(`Erro HTTP! Status: ${res.status}`);
      }

      const data = await res.json();
      setAllUsers(data);
    } catch (error) {
      console.error("Erro ao criar a conversa:", error);
    }
  };

  const fecharConversa = () => {
    setSelectedConversation(null);
  };

  // ############## Funções de convites #################

  const fetchInvites = async () => {
    try {
      const data = await BuscarConvites(userId);
      setSentInvites(data.sentInvites);
      setReceivedInvites(data.receivedInvites);
    } catch (error) {
      console.error("Erro ao buscar convites:", error);
    }
  };

  const convidar = async (recepId: number) => {
    setLoading(true);
    try {
      const res = await EnviarConvite(recepId, userId);
      if (res.ok) {
        fetchInvites();
        invitationSentOk();
      } else {
        invitationSentError();
        console.error("Erro ao enviar convite");
      }
    } catch (error) {
      console.error("Erro ao enviar convite:", error);
    }
    setLoading(false);
  };

  const aceitarConvite = async (invitationId: number, senderId: number) => {
    setLoading(true);
    try {
      const res = await AcceptConvite(invitationId);

      if (res.ok) {
        invitationAcceptedOk();
        CriarConversa(senderId);
        setModalAcceptAndRemove(false);
        fetchInvites();
      } else {
        console.error("Erro ao aceitar convite");
        invitationAcceptedErro();
      }
    } catch (error) {
      console.error("Erro ao aceitar convite:", error);
    }
    setLoading(false);
  };

  const recusarConvite = () => {};

  // ############## Funções de Modal #################

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

  const showModalPerfil = () => {
    setconversasModal(false);
    setaddConversaModal(false);
    setconvitesModal(false);
    setPerfilModal(true);
    setModalAberto("perfil");
  };

  // ############## Funções de usuários e outros #################

  const fetchAllUsers = async () => {
    try {
      const data = await BuscarUsuarios();
      setAllUsers(data);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query.trim() !== "") {
      const filtered = allUsers.filter((user) =>
        user.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredUsers(filtered);
      setShowModal(true); 
    } else {
      setFilteredUsers([]);
      setShowModal(false);
    }
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
    convidar,
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
    loading,
    setModalAcceptAndRemove,
    modalAcceptAndRemove,
    logOut: () => router.push('/'),
  };
};

export default useChat;
