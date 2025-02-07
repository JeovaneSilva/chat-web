import { useUserContext } from "@/context/UserContext";
import useChat from "@/hooks/useChat";

const ModalConversas = () => {
    const {
        conversations,
        selectedConversation,
        selectConversation,
        searchTerm,
        setSearchTerm,
        filteredConversations,
      } = useChat();

      const {userId} = useUserContext()

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

export default ModalConversas;
