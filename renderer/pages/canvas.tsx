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
        return {
          id,
          type,
          x: Math.min(x1, x2),
          y: Math.min(y1, y2),
          x3: x1,   // Initial mouse down x coordinate
          y3: y1,   // Initial mouse down y coordinate
          width: x2 - x1,
          height: y2 - y1,
          options: {
            stroke: options.stroke,
            strokeWidth: options.strokeWidth,
            fill: options.fill,
          },
        };
      case "circle":
        return {
          id,
          type,
          x: x1,
          y: y1,
          radius: Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)),
          options: {
            stroke: options.stroke,
            strokeWidth: options.strokeWidth,
            fill: options.fill,
          },
        };
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

  const drawElementOnCanvas = (canvases, context, element) => {
    const { type, options } = element;

    // Set up canvas context based on element options
    context.strokeStyle = options.stroke;
    context.lineWidth = options.strokeWidth;
    if (options.fill) {
      context.fillStyle = options.stroke;
    }

    switch (type) {
      case "line":
        context.beginPath();
        context.moveTo(element.x1, element.y1);
        context.lineTo(element.x2, element.y2);
        context.stroke();
        break;
      case "rectangle":
        if (options.fill) {
          context.fillRect(element.x, element.y, element.width, element.height);
        } else {
          context.strokeRect(element.x, element.y, element.width, element.height);
        }
        break;
      case "circle":
        context.beginPath();
        context.arc(element.x, element.y, element.radius, 0, 2 * Math.PI);
        if (options.fill) {
          context.fill();
        }
        context.stroke();
        break;
      case "brush":
        context.beginPath();
        context.moveTo(element.points[0].x, element.points[0].y);
        element.points.forEach(point => {
          context.lineTo(point.x, point.y);
        });
        context.stroke();
        break;
      case "eraser":
        context.beginPath();
        context.moveTo(element.points[0].x, element.points[0].y);
        element.points.forEach(point => {
          context.lineTo(point.x, point.y);
        });
        context.stroke();
        break;
      case "text":
        context.font = options.font;
        context.fillStyle = options.fill;
        context.fillText(element.text, element.x1, element.y1);
        break;
      default:
        throw new Error(`Type not recognised: ${type}`);
    }
  };

  const adjustmentRequired = (type) => ["line", "rectangle"].includes(type);

  const updateElement = (id, x1, y1, x2, y2, type, options) => {
    const elementsCopy = elements.map(element => {
      if (element.id === id) {
        switch (type) {
          case "line":
            return { ...element, x1, y1, x2, y2, options };
          case "rectangle":
            let width = Math.abs(x2 - element.x3);
            let height = Math.abs(y2 - element.y3);
            let newX = x2 < element.x3 ? x2 : x1;
            let newY = y2 < element.y3 ? y2 : y1;
            return { ...element, x: newX, y: newY, width, height, options };
          case "circle":
            const radius = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
            return { ...element, x: x1, y: y1, radius, options };
          case "brush":
          case "eraser":
            return { ...element, points: [...element.points, { x: x2, y: y2 }], options };
          case "text":
            // return { ...element, x1, y1, text, options };
            break
          default:
            throw new Error(`Type not recognised: ${type}`);
        }
      }
      return element;
    });

    setElements(elementsCopy, true);
  };


  const handleMouseDown = (event) => {
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
      const element = createElement({
        id: elements.length,
        x1: clientX,
        y1: clientY,
        x2: clientX + 1,
        y2: clientY + 1,
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
    if (appState.cursorFocus) {
      focus(event);
    }

    const { clientX, clientY } = event;

    if (tool === "selection") {
      const element = getElementAtPosition(clientX, clientY, elements);
      event.target.style.cursor = element ? cursorForPosition(element.position) : "default";
    }

    if (action === "drawing") {
      const index = elements.length - 1;
      const { x1, y1, x, y, options } = elements[index];
      switch (tool) {
        case 'rectangle':
          updateElement(index, x, y, clientX, clientY, tool, options);
          break;
        case 'circle':
          updateElement(index, x, y, clientX, clientY, tool, options);
          break;
        default:
          updateElement(index, x1, y1, clientX, clientY, tool, options);
          break;
      }
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
        const { id, x1, x2, y1, y2, type, offsetX, offsetY, options } = selectedElement;
        const width = x2 - x1;
        const height = y2 - y1;
        const newX1 = clientX - offsetX;
        const newY1 = clientY - offsetY;
        updateElement(id, newX1, newY1, newX1 + width, newY1 + height, type, options);
      }
    } else if (action === "resizing") {
      const { id, type, position, options, ...coordinates } = selectedElement;
      const { x1, y1, x2, y2 } = resizedCoordinates(clientX, clientY, position, coordinates);
      updateElement(id, x1, y1, x2, y2, type, options);
    }
  };

  const handleMouseUp = (event) => {
    const { clientX, clientY } = event;
    if (selectedElement) {
      if (selectedElement.type === "text" && clientX - selectedElement.offsetX === selectedElement.x1 && clientY - selectedElement.offsetY === selectedElement.y1) {
        setAction("writing");
        return;
      }

      const index = selectedElement.id;
      if (elements[index]) {
        const { id, type, options } = elements[index];
        if ((action === "drawing" || action === "resizing") && adjustmentRequired(type)) {
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
