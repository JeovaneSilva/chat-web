"use client";
import { ToastContainer } from "react-toastify";
import { BiMessageAdd, BiMessageDetail } from "react-icons/bi";
import { MdOutlineMailOutline, } from "react-icons/md";
import { FaArrowLeft } from "react-icons/fa6";
import { GoPaperAirplane } from "react-icons/go";
import Image from "next/image";
import clickConversa from "../../assets/clickConversa.svg";
import "react-toastify/dist/ReactToastify.css";
import useChat from "@/hooks/useChat";
import LoadingSpinner from "../Loading";
import Mensagens from "@/components/mensagens";
import { useUserContext } from "@/context/UserContext";
import Perfil from "./components/Perfil";
import ConvitesChat from "./components/convitesChat";
import AddConversas from "./components/addConversas";

const ChatPage = () => {
  const {
    conversations,
    selectedConversation,
    selectConversation,
    updateMessage,
    modalAberto,
    showModalConversas,
    showModalAddConversa,
    showModalConvites,
    showModalPerfil,
    convitesModal,
    perfilModal,
    conversasModal,
    addConversaModal,
    fecharConversa,
    messages,
    messagesEndRef,
    newMessage,
    setNewMessage,
    handleSendMessage,
    loading,
    searchTerm,
    setSearchTerm,
    filteredConversations,
  } = useChat();

  const { fotoPerfil, userId} = useUserContext();

  const modalConversas = () => {
    return (
      <div className="text-white w-full pt-4 items-center">
        <div className="mb-4 flex flex-col pl-6 w-full">
          <h2 className="text-2xl font-bold mb-4">Conversas</h2>
          <input
            type="search"
            placeholder="Buscar suas conversas"
            className="w-[70%] sm:w-[95%] h-6 text-black p-4 border border-black rounded-[10px] outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Atualiza o estado com o termo de pesquisa
          />
        </div>

        {conversations.length > 0 ? (
          filteredConversations.length > 0 ? (
            <div className="mt-10">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  // Adiciona a classe de fundo escuro se a conversa estiver selecionada
                  className={`${
                    selectedConversation === conversation.id
                      ? "bg-[#306080]"
                      : "hover:bg-gray-200"
                  } cursor-pointer font-bold p-1 text-[#133347] flex w-[100%]`}
                  onClick={() => selectConversation(conversation.id)}
                >
                  <div className="flex items-center justify-between w-full p-1 sssm:p-2">
                    <div className="flex items-center gap-5">
                      <div className="flex border w-[60px] h-[60px] ml-0 border-black rounded-[100%] sm:ml-2">
                        <img
                          src={`${
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
            <div className="ml-6 mt-4">Nenhuma conversa encontrada</div>
          )
        ) : (
          <div className="ml-6 mt-4">Você não possui conversas</div>
        )}
      </div>
    );
  };

  const addConversas = () => {
    return <AddConversas />
  };

  const convitesChat = () => {
    return <ConvitesChat />
  };

  const perfil = () => {
    return <Perfil />
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
                    src={`${fotoPerfil}`}
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

        <div className=" w-3/5 h-screen flex flex-col shadow-lg">
          {selectedConversation ? (
            <div className="w-screen z-30 sm:w-auto sm:z-0 flex flex-col h-full border-l border-black bg-[#8ab3cf]">
              {/* Cabeçalho fixo */}
              <div className="flex bg-[#4180ab] h-[60px] items-center justify-start pl-2 border-b border-black">
                <button
                  className="block sm:hidden"
                  onClick={() => fecharConversa()}
                >
                  <FaArrowLeft className="text-xl" />
                </button>
                {conversations
                  .filter((conversa) => conversa.id == selectedConversation)
                  .map((conversation) => (
                    <div
                      key={conversation.id}
                      className="cursor-pointer font-bold text-[#122f42] flex"
                    >
                      <div className="ml-2 flex items-center gap-4">
                        <img
                          src={`${
                            conversation.user1Id === Number(userId)
                              ? conversation.user2.profilePicture
                              : conversation.user1.profilePicture
                          }`}
                          className="rounded-[100%] w-[40px] h-[40px]"
                          alt="Profile Picture"
                        />
                        <p className="text-xl">
                          {conversation.user1Id === Number(userId)
                            ? `${conversation.user2.name}`
                            : `${conversation.user1.name}`}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <ul className="flex flex-col gap-3">
                  {messages.map((message) => (
                    <Mensagens
                      key={message.id}
                      content={message.content}
                      messageId={message.id}
                      senderId={message.senderId}
                      userId={userId}
                      messageCreatedAt={message.createdAt}
                      onUpdateMessage={updateMessage}
                    />
                  ))}
                  <div ref={messagesEndRef} />
                </ul>
              </div>

              {/* Input de mensagens */}
              <div className="flex h-[60px] w-full border-t border-black">
                <input
                  type="text"
                  placeholder="Digite sua mensagem..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="w-full p-2 border rounded-l-md outline-none"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-blue-500 text-white p-2 rounded-r-md w-[60px] flex items-center justify-center"
                >
                  <GoPaperAirplane className="text-3xl" />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-[#8ab3cf] h-full flex flex-col items-center justify-center">
              <Image src={clickConversa} alt="" width={500} height={500} />
              <p className="text-xl font-semibold mt-[-40px]">
                Clique em uma conversa para abrir
              </p>
            </div>
          )}
        </div>
      </div>

      {/* modais */}

      {loading && <LoadingSpinner />}

      <ToastContainer />
    </main>
  );
};

export default ChatPage;
