import React, { useEffect, useRef, useState } from "react";
import { useAppState, useUpdateAppState } from "../context/appContext";
import { useHistory } from "../hooks/useHistory";
import { ICanvasTools, IElement } from "../interfaces";
import {
  adjustElementCoordinates,
  cursorForPosition,
  getElementAtPosition,
  resizedCoordinates,
} from "../utils/math";

export default function Canvas() {
  // ? app state that sysncs between windows using custome hook `useAppState()`
  const appState = useAppState();
  // ? app state update context
  const updateAppState = useUpdateAppState();

  const [action, setAction] = useState("none");
  const [elements, setElements, undo, redo, clear, redoEnabled, undoEnabled] =
    useHistory([]);
  const [tool, setTool] = useState<ICanvasTools>("brush");
  const [selectedElement, setSelectedElement] = useState(null);
  const canvasRef = useRef(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const canvasCursorRef = useRef(null);
  const ctxCursorRef = useRef<CanvasRenderingContext2D | null>(null);

  const createElement = (newElement: IElement) => {
    let canvasElement;
    const { id, type, text, x1, x2, y1, y2, options } = newElement;
    switch (newElement.type) {
      case "line":
        break;
      case "rectangle":
        break;
      case "circle":
        if (!options.fill) {

        } else {

        }
        break;
      case "brush":
      case "eraser":
        return { id, type, points: [{ x: x1, y: y1 }], options };
      case "text":
        return { id, type, x1, y1, x2, y2, text, options };
      default:
        throw new Error(`Type not recognised: ${type}`);
    }
    return {
      ...newElement,
      canvasElement,
    };
  };


  const drawElementOnCanvas = (roughCanvas, context, element: IElement) => {
    switch (element.type) {
      case "line":
      case "rectangle":
      case "circle":
      case "brush":
      case "eraser":
      case "text":
        break;
      default:
        throw new Error(`Type not recognised: ${element.type}`);
    }
    updateAppState({
      ...appState,
      redoEnabled: redoEnabled(),
      undoEnabled: undoEnabled(),
      selectedTool: tool,
    });
  };
  const adjustmentRequired = (type) => ["line", "rectangle"].includes(type);

  const updateElement = (id, x1, y1, x2, y2, type, options) => {
    const elementsCopy = [...elements];
    switch (type) {
      case "line":
      case "rectangle":
      case "circle":
      case "brush":
      case "eraser":
      case "text":
        break;
      default:
        throw new Error(`Type not recognised: ${type}`);
    }
    setElements(elementsCopy, true);
  };

  const handleMouseDown = (event) => {
    //highlight(event);
    if (appState.cursorFocus) {
      highlight(event);
    }
    if (action === "writing") return;
    const { clientX, clientY } = event;
    if (tool === "selection") {
      const element = getElementAtPosition(clientX, clientY, elements);
      if (element) {
        if (element.type === "brush") {
          const xOffsets = element.points.map((point) => clientX - point.x);
          const yOffsets = element.points.map((point) => clientY - point.y);
          setSelectedElement({ ...element, xOffsets, yOffsets });
        } else {
          const offsetX = clientX - element.x1;
          const offsetY = clientY - element.y1;
          setSelectedElement({ ...element, offsetX, offsetY });
        }
        setElements((prevState) => prevState);

        if (element.position === "inside") {
          setAction("moving");
        } else {
          setAction("resizing");
        }
      }
    } else {
      const element: IElement = createElement({
        id: elements.length,
        x1: clientX,
        y1: clientY,
        x2: clientX,
        y2: clientY,
        type: tool,
        options: {
          stroke: appState.activeColor,
          strokeWidth: appState.stroke,
          fill: appState.fill,
          fillWeight: appState.stroke, // thicker lines for hachure
        },
      });
      setElements((prevState) => [...prevState, element]);
      setSelectedElement(element);
      setAction(tool === "text" ? "writing" : "drawing");
    }
  };

  const handleMouseMove = (event) => {
    // canvasCursorRef.current.style.cursor = `url("data:image/svg+xml,%3Csvg width='19' height='19' viewBox='0 0 19 19' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1.75 1.25L7.25 2.25L15.25 10.25L16.8358 11.8358C17.6168 12.6168 17.6168 13.8832 16.8358 14.6642L15.6642 15.8358C14.8832 16.6168 13.6168 16.6168 12.8358 15.8358L11.25 14.25L3.25 6.25L1.75 1.25Z' fill='white'/%3E%3Cpath d='M15.25 10.25L7.25 2.25L1.75 1.25L3.25 6.25L11.25 14.25M15.25 10.25L16.8358 11.8358C17.6168 12.6168 17.6168 13.8832 16.8358 14.6642L15.6642 15.8358C14.8832 16.6168 13.6168 16.6168 12.8358 15.8358L11.25 14.25M15.25 10.25L11.25 14.25' stroke='black'/%3E%3C/svg%3E%0A"),
    // auto`;
    if (appState.cursorFocus) {
      focus(event);
    }
    const { clientX, clientY } = event;
    if (tool === "selection") {
      const element = getElementAtPosition(clientX, clientY, elements);
      event.target.style.cursor = element
        ? cursorForPosition(element.position)
        : "default";
    }
    if (action === "drawing") {
      const index = elements.length - 1;
      const { x1, y1, options } = elements[index];
      updateElement(index, x1, y1, clientX, clientY, tool, options);
    } else if (action === "moving") {
      if (selectedElement.type === "brush") {
        const newPoints = selectedElement.points.map((_, index) => ({
          x: clientX - selectedElement.xOffsets[index],
          y: clientY - selectedElement.yOffsets[index],
        }));
        const elementsCopy = [...elements];
        elementsCopy[selectedElement.id] = {
          ...elementsCopy[selectedElement.id],
          points: newPoints,
        };
        setElements(elementsCopy, true);
      } else {
        const { id, x1, x2, y1, y2, type, offsetX, offsetY, options } =
          selectedElement;
        const width = x2 - x1;
        const height = y2 - y1;
        const newX1 = clientX - offsetX;
        const newY1 = clientY - offsetY;
        updateElement(
          id,
          newX1,
          newY1,
          newX1 + width,
          newY1 + height,
          type,
          options
        );
      }
    } else if (action === "resizing") {
      const { id, type, position, options, ...coordinates } = selectedElement;
      const { x1, y1, x2, y2 } = resizedCoordinates(
        clientX,
        clientY,
        position,
        coordinates
      );
      updateElement(id, x1, y1, x2, y2, type, options);
    }
  };

  const handleMouseUp = (event) => {
    const { clientX, clientY } = event;
    if (selectedElement) {
      if (
        selectedElement.type === "text" &&
        clientX - selectedElement.offsetX === selectedElement.x1 &&
        clientY - selectedElement.offsetY === selectedElement.y1
      ) {
        setAction("writing");
        return;
      }

      const index = selectedElement.id;
      if (elements[index]) {
        const { id, type, options } = elements[index];
        if (
          (action === "drawing" || action === "resizing") &&
          adjustmentRequired(type)
        ) {
          const { x1, y1, x2, y2 } = adjustElementCoordinates(elements[index]);
          updateElement(id, x1, y1, x2, y2, type, options);
        }
      }
    }

    if (action === "writing") return;

    setAction("none");
    setSelectedElement(null);
  };

  const handleBlur = (event) => {
    const { id, x1, y1, type, options } = selectedElement;
    setAction("none");
    setSelectedElement(null);
    updateElement(id, x1, y1, null, null, type, {
      ...options,
      text: event.target.value,
    });
  };

  const getMousePos = (canvas, evt) => {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top,
    };
  };

  // Focus canvas (highlight cursor)
  const focus = (e) => {
    if (ctxCursorRef.current) {
      ctxCursorRef.current.clearRect(
        0,
        0,
        canvasCursorRef.current.width,
        canvasCursorRef.current.height
      );
      ctxCursorRef.current.beginPath();
      ctxCursorRef.current.rect(
        0,
        0,
        canvasCursorRef.current.width,
        canvasCursorRef.current.height
      );
      ctxCursorRef.current.globalCompositeOperation = "source-over";
      ctxCursorRef.current.fill();
      ctxCursorRef.current.beginPath();
      const pos = getMousePos(canvasCursorRef.current, e);
      ctxCursorRef.current.fillStyle = "#00000090";
      ctxCursorRef.current.arc(pos.x, pos.y, 70, 0, 2 * Math.PI); // x,y,diameter
      ctxCursorRef.current.globalCompositeOperation = "destination-out";
      ctxCursorRef.current.fill();
    }
  };

  const highlight = (e) => {
    // const highlight: any = document.getElementsByClassName("highlight");
    // highlight.style.top = e.clientY + window.innerHeight - 15 + "px";
    // highlight.style.left = e.clientX + innerWidth - 15 + "px";
    // $("#"+uniqueid+" #click-highlight").css("top", e.clientY+$(window).scrollTop()-15+"px");
    // $("#"+uniqueid+" #click-highlight").css("left", e.clientX+$(window).scrollLeft()-15+"px");
    // $("#"+uniqueid+" #click-highlight").addClass("show-click");
  };

  useEffect(() => {
    if (window) {
      const canvasFocus = canvasCursorRef.current;
      canvasFocus.height = window.innerHeight;
      canvasFocus.width = window.innerWidth;
      ctxCursorRef.current = canvasFocus.getContext("2d");

      const canvas: HTMLCanvasElement = canvasRef.current;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const context: any = canvas.getContext("2d");
      ctxRef.current = context;

      elements.forEach((element) => {
        if (action === "writing" && selectedElement.id === element.id) return;
        drawElementOnCanvas(canvas, context, element);
      });
    }
  }, [elements, action, selectedElement]);

  useEffect(() => {
    const undoRedoFunction = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "z") {
        if (event.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
    };

    document.addEventListener("keydown", undoRedoFunction);
    return () => {
      document.removeEventListener("keydown", undoRedoFunction);
    };
  }, [undo, redo]);

  useEffect(() => {
    // if (textAreaRef.current) {
    //   const textArea: any = textAreaRef.current;
    //   if (action === "writing") {
    //     textArea?.focus();
    //     textArea.value = selectedElement.text;
    //   }
    // }
  }, [action, selectedElement]);

  useEffect(() => {
    // if(window) window.alert("component loaded ")
    if (!appState.currentFocus) {
      ctxCursorRef.current.clearRect(
        0,
        0,
        canvasCursorRef.current.width,
        canvasCursorRef.current.height
      );
    }
    switch (appState.selectedTool) {
      case "clear":
        clear();
        updateAppState({ ...appState, selectedTool: tool });
        return;
      case "undo":
        undo();
        updateAppState({
          ...appState,
          undoEnabled: undoEnabled(),
          selectedTool: tool,
        });
        return;
      case "redo":
        redo();
        updateAppState({
          ...appState,
          redoEnabled: redoEnabled(),
          selectedTool: tool,
        });
        return;
      case "stroke":
        // updateStroke();
        updateAppState({ ...appState, selectedTool: tool });
        return;
      case "text":
        setAction("writing");
        break;
      default:
        break;
    }
    setTool(appState.selectedTool);
  }, [appState]);

  return (
    <>
      <span className="highlight" />
      <canvas
        id="canvas-cursor"
        ref={canvasCursorRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
      <canvas
        id="canvas"
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
    </>
  );
}
