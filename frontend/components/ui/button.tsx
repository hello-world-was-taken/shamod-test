import React from "react";

interface ButtonProps {
  text: string;
}

const Button: React.FC<ButtonProps> = ({ text }: ButtonProps) => {
  const handleClick = () => {
    alert("Button was clicked!");
  };

  return (
    <button
      className="bg-[#C53F3F] rounded-md text-white border poppins border-transparent w-32 md:w-1/3 py-4 text-lg font-bold hover:text-[#C53F3F] hover:bg-transparent hover:border-gray-500"
      type="submit"
    >
      { text }
    </button>
  );
};

export default Button;
