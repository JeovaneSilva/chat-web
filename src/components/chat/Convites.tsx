import useChat from '@/hooks/useChat';
import React from 'react'
import { FaRegTrashAlt } from 'react-icons/fa';
import { FaCheck } from 'react-icons/fa6';

const Convites = () => {

    const {
        sentInvites,
        receivedInvites,
        aceitarConvite,
        recusarConvite
      } = useChat();

    return (
        <div className="text-white w-full pt-4 pl-6">
          <div className="mb-4 flex flex-col w-full">
            <h2 className="text-2xl font-bold mb-4">Convites</h2>
          </div>
          <div className="flex flex-col w-[95%]">
            <div>
              <h2 className="text-xl font-bold mb-4">Enviados</h2>
              <div className="mt-5">
                {sentInvites.length > 0 ? (
                  sentInvites.map((invite) => (
                    <div key={invite.id} className="flex flex-col w-full">
                      <div className="w-full flex items-center sm:flex-col sm:items-start justify-between pr-2 pb-2 md:items-center md:flex-row">
                        <div className="flex items-center gap-2">
                          <div className="flex w-[50px] h-[50px] border border-black rounded-[100%] ">
                            <img
                              src={`http://localhost:3333/uploads/profile_pictures/${invite.receiver.profilePicture}`}
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
              <h2 className="text-sm font-bold mt-6">Recebidos</h2>
              <div className="mt-5">
                {receivedInvites.length > 0 ? (
                  receivedInvites.map((invite) => (
                    <div key={invite.id} className="flex flex-col w-full">
                      <div className="w-full flex items-center sm:flex-col sm:items-start justify-between pr-2 pb-2 lg:flex-row lg:items-center">
                        <div className="flex items-center gap-2 ">
                          <div className="flex w-[50px] h-[50px] border border-black rounded-[100%] ">
                            <img
                              src={`http://localhost:3333/uploads/profile_pictures/${invite.sender.profilePicture}`}
                              className="rounded-[100%]  w-full h-full"
                              alt="Profile Picture"
                            />
                          </div>
                          <p className="font-bold text-[#122f42]">
                            {invite.sender.name}
                          </p>
                        </div>
                        <div className="flex gap-2 items-center justify-center sm:mt-2 lg:mt-0">
                          <p className="bg-gray-200 text-xs p-1 text-black rounded-[10px]">
                            {invite.status}
                          </p>
                          {invite.status == "PENDING" && (
                            <div className=" flex gap-2">
                              <button
                                onClick={() =>
                                  aceitarConvite(invite.id, invite.senderId)
                                }
                                className="bg-[#2da555] text-white font-bold w-[30px] h-[30px] flex items-center justify-center rounded-[10px] text-sm p-2"
                              >
                                <FaCheck className="text-xl" />
                              </button>
                              <button
                                onClick={() => recusarConvite()}
                                className="bg-[#df3c3c] text-white font-bold w-[30px] h-[30px] flex items-center justify-center rounded-[10px] text-sm p-2"
                              >
                                <FaRegTrashAlt className="text-xl" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-black sm:text-base">
                    Você não recebeu nenhum convite.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      );
}

export default Convites