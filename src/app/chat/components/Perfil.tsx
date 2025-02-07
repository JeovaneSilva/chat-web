import { MdEdit } from "react-icons/md";
import { FaCheck, FaTimes } from "react-icons/fa";
import { useUserContext } from "@/context/UserContext";
import useChat from "@/hooks/useChat";

const Perfil = () => {
  const { fotoPerfil, nomeUser } = useUserContext();
  const {
    editing,
    newNomeUser,
    setNewNomeUser,
    handleUpdateName,
    exitHandleUpdateName,
    setEditing,
    logOut
  } = useChat();

  return (
    <div className="text-white w-full pt-4 pl-6">
      <div className="mb-4 flex flex-col w-full">
        <h2 className="text-2xl font-bold mb-4">Perfil</h2>
      </div>
      <div className="flex flex-col w-full items-center justify-center mt-7">
        <div className="w-[100px] h-[100px] lg:w-[190px] lg:h-[190px]">
          <img
            src={fotoPerfil}
            className="rounded-[100%] w-full h-full"
            alt="Profile Picture"
          />
        </div>
        
      </div>

      <div className="w-full mt-[60px] sm:mt-[40px] flex flex-col items-start">
        <p className="text-base sm:text-lg md:text-xl text-black ">
          Nome de usuário
        </p>
        <div className="w-[95%] mt-3 flex items-center">
          {editing ? (
            <div className="flex w-full justify-between sm:flex-col lg:flex-row">
              <input
                type="text"
                value={newNomeUser}
                onChange={(e) => setNewNomeUser(e.target.value)}
                className="text-base w-[60%] outline-none bg-transparent border-0 text-black sm:text-lg md:text-xl ml-1 p-1 border-b-2"
              />
              <div className="flex gap-4 items-center sm:mt-4">
                <button
                  onClick={handleUpdateName}
                  className="w-[30px] h-[30px] md:w-auto md:h-auto flex items-center justify-center bg-green-500 text-white p-2 rounded-md"
                >
                  <FaCheck className="text-lg" />
                </button>
                <button
                  onClick={exitHandleUpdateName}
                  className="w-[30px] h-[30px] md:w-auto md:h-auto flex items-center justify-center bg-red-500 text-white p-2 rounded-md"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex w-full justify-between sm:flex-col lg:flex-row">
              <p className="text-base sm:text-xl ml-1">{nomeUser}</p>
              <MdEdit
                className="text-base sm:text-xl cursor-pointer sm:mt-4"
                onClick={() => setEditing(true)}
              />
            </div>
          )}
        </div>
      </div>

      <div className="mt-[60px] flex justify-center">
        <button
          onClick={() => logOut()}
          className="p-1 bg-[#8ab3cf] text-black w-[80px] rounded-xl"
        >
          Sair
        </button>
      </div>
    </div>
  );
};

export default Perfil;
