import { FaCheck, FaRegTrashAlt } from "react-icons/fa";
import useChat from "@/hooks/useChat";
import { FaEnvelopeOpenText } from "react-icons/fa6";
import Modal from "@/components/modal/Modal";

const ConvitesChat = () => {
  const {
    sentInvites,
    receivedInvites,
    aceitarConvite,
    recusarConvite,
    setModalAcceptAndRemove,
    modalAcceptAndRemove,
  } = useChat();

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

export default ConvitesChat;
