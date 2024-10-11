import useChat from '@/hooks/useChat';
import React from 'react'

const AddConversa = () => {

    const {
        userId,
        searchQuery,
        handleSearch,
        showModal,
        filteredUsers,
        sentInvites,
        enviarConvite,
      } = useChat();

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
}

export default AddConversa