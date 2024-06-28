import React from "react";
import "./suggestion.css";
import { MessageSide, SuggestionType } from "../../../../types";
import clsx from "clsx";

interface ISuggestion {
  suggestion: string;
  // callback: (type: MessageSide, content: string) => void;
  onClick: () => void,
  clarification: boolean;
}

const Suggestion = (props: ISuggestion) => {
  
  const { suggestion, onClick, clarification } = props;
  
  return (
    <div
      className={clsx(
        "suggestion-container",
        clarification ? "clarification" : ""
      )}
      onClick={onClick}
    >
      {suggestion}
    </div>
  );
};

export default Suggestion;
