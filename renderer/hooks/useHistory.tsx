import { useState } from "react";

export const useHistory = (initialState) => {
  const [index, setIndex] = useState(0);
  const [history, setHistory] = useState<any>([initialState]);

  const setState = (action, overwrite = false) => {
    const newState =
      typeof action === "function" ? action(history[index]) : action;
    if (overwrite) {
      const historyCopy = [...history];
      historyCopy[index] = newState;
      setHistory(historyCopy);
    } else {
      const updatedState = [...history].slice(0, index + 1);
      setHistory([...updatedState, newState]);
      setIndex((prevState) => prevState + 1);
    }
  };

  const undo = () => index > 0 && setIndex((prevState) => prevState - 1);
  const redo = () =>
    index < history.length - 1 && setIndex((prevState) => prevState + 1);
  const redoEnabled = () => index < history.length;
  const undoEnabled = () => index >= 0;
  const clear = () => index > 0 && setIndex(0);
  return [
    history[index],
    setState,
    undo,
    redo,
    clear,
    redoEnabled,
    undoEnabled,
  ];
};
