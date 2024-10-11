import useChat from '@/hooks/useChat';
import React from 'react'

const Perfil = () => {

    const {
        nomeUser,
        fotoPerfil
      } = useChat();

    return (
        <div className="text-white w-full pt-4 pl-6">
          <div className="mb-4 flex flex-col w-full">
            <h2 className="text-2xl font-bold mb-4">Perfil</h2>
          </div>
          <div className="flex flex-col w-full items-center justify-center mt-7">
            <div className="w-[100px] h-[100px] lg:w-[200px] lg:h-[200px]">
              <img
                src={`http://localhost:3333/uploads/profile_pictures/${fotoPerfil}`}
                className="rounded-[100%]  w-full h-full"
                alt="Profile Picture"
              />
            </div>
            <p className="text-3xl mt-6">{nomeUser}</p>
          </div>
        </div>
      );
}

export default Perfil