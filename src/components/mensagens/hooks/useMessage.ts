// hooks/useMensagemLogic.ts
import { useState, useEffect } from "react";
import { Message } from "@/types/Chat";

interface UseMensagemLogicProps {
  messageCreatedAt: string;
  senderId: number;
  userId: number;
  messageId: number;
  content: string;
  onUpdateMessage: (messageId: number, updatedContent: Partial<Message>) => void;
}

const useMensagemLogic = ({
  messageCreatedAt,
  senderId,
  userId,
  messageId,
  content,
  onUpdateMessage,
}: UseMensagemLogicProps) => {
  const [showMenuButton, setShowMenuButton] = useState(false);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [selectedIdMessage, setSelectedIdMessage] = useState<number | null>(null);
  const [newContent, setNewContent] = useState<string>("");  
  const [isEditable, setIsEditable] = useState(false);

  useEffect(() => {
    const messageTime = new Date(messageCreatedAt);
    const now = new Date();
    const diffInMinutes = (now.getTime() - messageTime.getTime()) / (1000 * 60);
    setIsEditable(diffInMinutes < 10);
  }, [messageCreatedAt]);

  const handleMouseEnter = () => {
    if (senderId === Number(userId)) {
      setShowMenuButton(true);
    }
  };

  const handleMouseLeave = () => {
    setShowMenuButton(false);
  };

  const openMenuModal = () => {
    setSelectedMessage(content);
    setSelectedIdMessage(messageId);
    setIsMenuModalOpen(true);
  };

  const closeMenuModal = () => {
    setIsMenuModalOpen(false);
    setSelectedMessage(null);
    setSelectedIdMessage(null);
  };

  const openEditModal = () => {
    setNewContent(selectedMessage || "");
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleEdit = async () => {
    try {
      if (!selectedIdMessage) return;

      if (!newContent.trim()) {
        console.error("O conteúdo da mensagem não pode estar vazio.");
        return;
      }

      const url = `${process.env.NEXT_PUBLIC_API_URL}messages/${selectedIdMessage}`;
      const response = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newContent }),
      });

      if (!response.ok) throw new Error("Erro ao atualizar a mensagem");

      const updatedMessage = await response.json();
      onUpdateMessage(messageId, { content: newContent });
      closeEditModal();
      closeMenuModal();
    } catch (error) {
      console.error("Erro ao atualizar a mensagem:", error);
    }
  };

  const handleCopyMessage = async () => {
    if (selectedMessage) {
      try {
        await navigator.clipboard.writeText(selectedMessage);
        alert("Mensagem copiada com sucesso!");
      } catch (error) {
        console.error("Erro ao copiar a mensagem:", error);
      }
    }
  };

  return {
    showMenuButton,
    isMenuModalOpen,
    isEditModalOpen,
    selectedMessage,
    selectedIdMessage,
    newContent,
    setNewContent,
    isEditable,
    handleMouseEnter,
    handleMouseLeave,
    openMenuModal,
    closeMenuModal,
    openEditModal,
    closeEditModal,
    handleEdit,
    handleCopyMessage,
  };
};

export default useMensagemLogic;
