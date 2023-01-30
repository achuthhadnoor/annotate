import getStroke from "perfect-freehand";
import React, { useEffect, useRef, useState } from "react";
import rough from "roughjs/bundled/rough.cjs";
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
  const textAreaRef = useRef(null);
  const canvasRef = useRef(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const canvasCursorRef = useRef(null);
  const ctxCursorRef = useRef<CanvasRenderingContext2D | null>(null);

  const roughCanvasRef = useRef(null);

  const generator = rough.generator();

  const createElement = (newElement: IElement) => {
    let roughElement;
    const { id, type, text, x1, x2, y1, y2, options } = newElement;
    switch (newElement.type) {
      case "line":
        roughElement = generator.line(x1, y1, x2, y2, {
          stroke: options.stroke,
          strokeWidth: options.strokeWidth,
        });
        break;
      case "rectangle":
        roughElement = generator.rectangle(x1, y1, x2 - x1, y2 - y1, {
          roughness: 2.8,
          stroke: options.stroke,
          strokeWidth: options.strokeWidth,
          fill: options.fill ? options.activeColor : "",
        });
        break;
      case "circle":
        if (!options.fill) {
          roughElement = generator.circle(x1, y1, x2 - x1, {
            stroke: options.stroke,
            strokeWidth: options.strokeWidth,
          });
        } else {
          roughElement = generator.circle(x1, y1, x2 - x1, {
            fill: options.stroke,
            fillWeight: options.fillWeight, // thicker lines for hachure
          });
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
      roughElement,
    };
  };

  const getSvgPathFromStroke = (stroke) => {
    if (!stroke.length) return "";

    const d = stroke.reduce(
      (acc, [x0, y0], i, arr) => {
        const [x1, y1] = arr[(i + 1) % arr.length];
        acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
        return acc;
      },
      ["M", ...stroke[0], "Q"]
    );

    d.push("Z");
    return d.join(" ");
  };

  const drawElementOnCanvas = (roughCanvas, context, element: IElement) => {
    switch (element.type) {
      case "line":
      case "rectangle":
      case "circle":
        roughCanvas.draw(element.roughElement);
        break;
      case "brush":
      case "eraser":
        const stroke = getSvgPathFromStroke(
          getStroke(element.points, {
            size: element.options.strokeWidth,
          })
        );
        context.fillStyle =
          element.type === "eraser" ? "#00000042" : element.options.stroke;
        // ctxCursorRef.current.fillStyle = "#00000087";
        context.fill(new Path2D(stroke));
        break;
      case "text":
        context.textBaseline = "top";
        context.font = "24px sans-serif";
        context.fillText(element.text, element.x1, element.y1);
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
        console.log("====================================");
        console.log(options);
        console.log("====================================");
        elementsCopy[id] = createElement({ id, x1, y1, x2, y2, type, options });
        break;
      case "brush":
      case "eraser":
        elementsCopy[id].points = [
          ...elementsCopy[id].points,
          { x: x2, y: y2 },
        ];
        break;
      case "text":
        if (textAreaRef.current) {
          let ref: any = textAreaRef.current;
          const textWidth = ref
            .getContext("2d")
            .measureText(options.text).width;
          const textHeight = 24;
          elementsCopy[id] = {
            ...createElement({
              id,
              x1,
              y1,
              x2: x1 + textWidth,
              y2: y1 + textHeight,
              type,
              options,
            }),
            text: options.text,
          };
        }
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
      const { id, type, options } = elements[index];
      if (
        (action === "drawing" || action === "resizing") &&
        adjustmentRequired(type)
      ) {
        const { x1, y1, x2, y2 } = adjustElementCoordinates(elements[index]);
        updateElement(id, x1, y1, x2, y2, type, options);
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
      ctxCursorRef.current.fillStyle = "#0000009e";
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

      const roughCanvas = rough.canvas(canvas);
      roughCanvasRef.current = roughCanvas;
      elements.forEach((element) => {
        if (action === "writing" && selectedElement.id === element.id) return;
        drawElementOnCanvas(roughCanvas, context, element);
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
    if (textAreaRef.current) {
      const textArea: any = textAreaRef.current;
      if (action === "writing") {
        textArea?.focus();
        textArea.value = selectedElement.text;
      }
    }
  }, [action, selectedElement]);

  useEffect(() => {
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
        ref={canvasRef}
        id="canvas-draw"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
      {action === "writing" ? (
        <textarea
          ref={textAreaRef}
          onBlur={handleBlur}
          style={{
            position: "fixed",
            // top: selectedElement.y1 - 2,
            // left: selectedElement.x1,
            font: "24px sans-serif",
            margin: 0,
            padding: 0,
            border: 0,
            outline: 0,
            // resize: "auto",
            overflow: "hidden",
            whiteSpace: "pre",
            background: "transparent",
          }}
        />
      ) : null}
    </>
  );
}
