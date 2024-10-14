import React from "react";

interface Props {
  children: React.ReactNode;
}

const Modal = ({ children }: Props) => {
  return (
    <div className="w-screen h-screen flex fixed right-0 top-0 bg-white/50 items-center justify-center z-[999]">
      <div className="bg-[#29495f] w-[300px]  sm:w-[400px]  h-[200px] rounded-[18px] flex justify-center items-center flex-col">
        {children}
      </div>
    </div>
  );
};

export default Modal;
