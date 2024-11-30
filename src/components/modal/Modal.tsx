import React from "react";

interface Props {
  children: React.ReactNode;
  width: string;
  smWidth:string;
  heigth:string;
}

const Modal = ({ children,width,smWidth,heigth }: Props) => {
  return (
    <div className={`w-screen h-screen flex fixed right-0 top-0 bg-white/50 items-center justify-center z-[999]`}>
      <div className={`bg-[#29495f] ${width} ${smWidth} ${heigth} py-8  rounded-[18px] flex justify-center items-center flex-col`}>
        {children}
      </div>
    </div>
  );
};

export default Modal;
