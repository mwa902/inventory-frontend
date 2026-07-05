import { useNavigate } from "react-router-dom";
import { useState } from "react";

const LimitedAction = ({ onContinue }) => {
  const navigate = useNavigate();

  const handleContinue = () => {
    if (onContinue) {
      onContinue();
      return;
    }

    navigate("/", { replace: true });
  };

  return (
    <div className="Main-structure">
      <div className="Blur-background">
        <p className="message-box">
          Following action cannot be performed due to the limitation by Super
          Action. Kindly contact your Super Action.
        </p>
        <button
          type="button"
          className="limited-access-button"
          onClick={handleContinue}
        >
          Go to Start
        </button>
      </div>
    </div>
  );
};

export default LimitedAction;
