import React from "react";
import { BsThreeDots } from "react-icons/bs";
import Modal from "../modal/Modal";
import { formatarData } from "@/utils/formData";
import useMensagemLogic from "./hooks/useMessage";
import { Message } from "@/types/Chat";

interface MensagensProps {
  content: string;
  messageId: number;
  senderId: number;
  userId: number;
  messageCreatedAt: string;
  onUpdateMessage: (messageId: number, updatedContent: Partial<Message>) => void;
}

const Mensagens = ({
  content,
  messageId,
  senderId,
  userId,
  messageCreatedAt,
  onUpdateMessage,
}: MensagensProps) => {
  const {
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
  } = useMensagemLogic({
    messageCreatedAt,
    senderId,
    userId,
    messageId,
    content,
    onUpdateMessage,
  });

  return (
    <>
      <li
        key={messageId}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`relative p-2 flex justify-between gap-4 w-auto min-w-[125px] max-w-[60%] sm:max-w-[50%] ${
          senderId === Number(userId)
            ? "bg-blue-100 text-blue-800 items-end self-end rounded-tl-2xl rounded-bl-2xl rounded-br-2xl"
            : "bg-gray-200 text-gray-800 items-end self-start rounded-tr-2xl rounded-bl-2xl rounded-br-2xl"
        }`}
      >
        {showMenuButton && senderId === Number(userId) && (
          <button
            className="absolute top-0 right-2 text-gray-500 hover:text-black"
            onClick={openMenuModal}
          >
            <BsThreeDots className="text-xl" />
          </button>
        )}
        <div className="flex flex-col break-words whitespace-normal gap-5 w-auto min-w-[60%]">
          <p className="text-xs sm:text-base break-words">
            {selectedIdMessage === messageId && selectedMessage
              ? selectedMessage
              : content}
          </p>
        </div>
        <p className="text-xs text-right mb-[-5px]">
          {formatarData(messageCreatedAt)}
        </p>
      </li>

      {/* Menu Modal */}
      {isMenuModalOpen && (
        <Modal width="w-[200px]" smWidth="sm:w-[200px]" heigth="h-auto">
          <div className="flex flex-col w-[160px] justify-end gap-4">
            {isEditable && (
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={openEditModal}
              >
                Editar
              </button>
            )}
            <button
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-800"
              onClick={handleCopyMessage}
            >
              Copiar
            </button>
            <button
              className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
              onClick={closeMenuModal}
            >
              Cancelar
            </button>
          </div>
        </Modal>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <Modal width="w-[400px]" smWidth="sm:w-[400px]" heigth="h-[200px]">
          <div className="flex w-[350px] flex-col gap-4">
            <textarea
              className="w-full h-[70px] max-h-[70px] min-h-[70px] border border-gray-300 rounded p-2"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
            />
            <div className="flex justify-end gap-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={handleEdit}
              >
                Salvar
              </button>
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                onClick={closeEditModal}
              >
                Cancelar
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default Mensagens;
