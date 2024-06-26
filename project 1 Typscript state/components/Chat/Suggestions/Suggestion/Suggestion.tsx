import React from "react";
import "./suggestion.css";
import { MessageSide, SuggestionType } from "../../../../types";
import clsx from "clsx";

interface ISuggestion {
  suggestion: string;
  callback?: (type: MessageSide, content: string) => void;
  clarification: boolean;
  onClick : () => void
}

const Suggestion = (props: ISuggestion) => {
  const { suggestion, onClick, clarification } = props;
  console.log("🚀 ~ Suggestion ~ suggestion:", suggestion)

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
