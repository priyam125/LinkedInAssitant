import React from 'react';
import AiIcon from './AiIcon';
import "../assets/main.css"
interface GenerateButtonProps {
  onClick: () => void;
}

const GenerateButton: React.FC<GenerateButtonProps> = ({ onClick }) => {
  return (
    <div className="cursor-pointer relative" onClick={onClick}>
      <AiIcon />
    </div>
  );
};

export default GenerateButton;
