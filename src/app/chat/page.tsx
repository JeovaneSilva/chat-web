"use client";
import { ToastContainer } from "react-toastify";
import { BiMessageAdd, BiMessageDetail } from "react-icons/bi";
import { MdOutlineMailOutline } from "react-icons/md";
import { FaArrowLeft, FaCheck } from "react-icons/fa6";
import { GoPaperAirplane } from "react-icons/go";
import { FaEnvelopeOpenText } from "react-icons/fa6";
import "react-toastify/dist/ReactToastify.css";

import useChat from "@/hooks/useChat";
import { FaRegTrashAlt } from "react-icons/fa";
import Modal from "@/components/modal/Modal";
import LoadingSpinner from "../Loading";
import Mensagens from "@/components/mensagens";

const ChatPage = () => {
  const {
    conversations,
    selectedConversation,
    selectConversation,
    updateMessage,
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
    verificarConvites,
    nomeUser,
    fotoPerfil,
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
    setModalAcceptAndRemove,
    modalAcceptAndRemove,
    logOut,
  } = useChat();

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
          <div className="ml-6 mt-4">Você não possui conversas</div>
        )}
      </div>
    );
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
                              src={`${user.profilePicture}`}
                              className="rounded-[100%]  w-full h-full"
                              alt="Profile Picture"
                            />
                          </div>
                          <p className="text-sm lg:text-xl">{user.name}</p>
                        </div>
                        {verificarConvites(user) && (
                          <button
                            onClick={() => convidar(user.id)}
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

  const convitesChat = () => {
    return (
      <div className="text-white w-full pt-4 pl-6">
        <div className="mb-4 flex flex-col w-full">
          <h2 className="text-2xl font-bold mb-4">Convites</h2>
        </div>
        <div className="flex flex-col w-[95%]">
          <div>
            <h2 className="text-base font-bold mb-4">Enviados</h2>
            <div className="mt-5">
              {sentInvites.length > 0 ? (
                sentInvites.map((invite) => (
                  <div key={invite.id} className="flex flex-col w-full">
                    <div className="w-full flex items-center sm:flex-col sm:items-start justify-between pr-2 pb-2 md:items-center md:flex-row">
                      <div className="flex items-center gap-2">
                        <div className="flex w-[50px] h-[50px] border border-black rounded-[100%] ">
                          <img
                            src={`${invite.receiver.profilePicture}`}
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
            <h2 className="text-base font-bold mt-6">Recebidos</h2>
            <div className="mt-5">
              {receivedInvites.length > 0 ? (
                receivedInvites.map((invite) => (
                  <div key={invite.id} className="flex flex-col w-full">
                    <div className="w-full flex items-center sm:flex-col sm:items-start justify-between pr-2 pb-2 lg:flex-row lg:items-center">
                      <div className="flex items-center gap-2 ">
                        <div className="flex w-[50px] h-[50px] border border-black rounded-[100%] ">
                          <img
                            src={`${invite.sender.profilePicture}`}
                            className="rounded-[100%]  w-full h-full"
                            alt="Profile Picture"
                          />
                        </div>
                        <p className="font-bold text-[#122f42]">
                          {invite.sender.name}
                        </p>
                      </div>
                      <div className="flex gap-5 items-center justify-center sm:mt-2 lg:mt-0">
                        <p className="bg-gray-200 text-xs p-1 text-black rounded-[10px]">
                          {invite.status}
                        </p>
                        {invite.status == "PENDING" && (
                          <div className=" flex ">
                            <button
                              onClick={() => setModalAcceptAndRemove(true)}
                            >
                              <FaEnvelopeOpenText className="text-2xl text-white" />
                            </button>
                            {modalAcceptAndRemove && (
                              <Modal
                                heigth="h-[200px]"
                                width="w-[300px]"
                                smWidth="w-[400px]"
                              >
                                <p className="max-w-[250px] text-center text-lg sm:max-w-[100%]">
                                  Você deseja aceitar o convite de{" "}
                                  <b>{invite.sender.name}</b>?
                                </p>
                                <div className="flex gap-10 mt-8">
                                  <button
                                    onClick={() =>
                                      setModalAcceptAndRemove(false)
                                    }
                                    className="bg-white w-[90px] h-[30px] text-black rounded-[10px] text-xl p-1 flex items-center justify-center"
                                  >
                                    Fechar
                                  </button>
                                  <div className="flex gap-4">
                                    <button
                                      onClick={() =>
                                        aceitarConvite(
                                          invite.id,
                                          invite.senderId
                                        )
                                      }
                                      className="bg-[#2da555] text-white font-bold w-[40px] h-[30px] flex items-center justify-center rounded-[10px] text-sm p-2"
                                    >
                                      <FaCheck className="text-xl" />
                                    </button>
                                    <button
                                      onClick={() => recusarConvite(invite.id)}
                                      className="bg-[#df3c3c] text-white font-bold w-[40px] h-[30px] flex items-center justify-center rounded-[10px] text-sm p-2"
                                    >
                                      <FaRegTrashAlt className="text-xl" />
                                    </button>
                                  </div>
                                </div>
                              </Modal>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-black sm:text-base">
                  Você não recebeu nenhum convite.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
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
              src={`${fotoPerfil}`}
              className="rounded-[100%]  w-full h-full"
              alt="Profile Picture"
            />
          </div>
          <p className="text-3xl mt-6">{nomeUser}</p>
          <div className="mt-7">
            <button
              onClick={() => logOut()}
              className="p-1 bg-[#8ab3cf] text-black w-[80px] rounded-xl"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    );
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
            <div className="w-screen z-30 sm:w-auto sm:z-0 flex flex-col p-2 h-full border-l border-black bg-[#8ab3cf]">
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

              {/* Área de mensagens rolável */}
              <div className="flex-1 overflow-y-auto ">
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
            <div className="bg-[#8ab3cf] h-full flex items-center justify-center">
              Clique em uma conversa para abrir
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
