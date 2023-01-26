import getStroke from "perfect-freehand";
import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Rough from "roughjs/bundled/rough.cjs";
import { useAppState, useUpdateAppState } from "../context/appContext";
import { ICanvasTools } from "../interfaces";

export default function Canvas() {
  // ? app state that sysncs between windows using custome hook `useAppState()`
  const appState = useAppState();
  // ? app state update context
  const updateAppState = useUpdateAppState();
  // ? active tool on the canvas
  const [toolType, setToolType] = useState<ICanvasTools>("brush");

  const [stroke, setStroke] = useState<number>(3);
  // ? collection of items on the canvas
  const [elements, setElements] = useState([]);
  // ? this stack hold the redo items after undo and if another action is performed on canvas this will be empty
  const [redoStak, setRedoStack] = useState([]);
  // ? drawing mode on canvas
  const [drawing, setDrawing] = useState(false);

  // canvas refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const generator = Rough.generator();

  const createElement = (
    id,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    type
  ) => {
    let roughElement = generator.line(x1, y1, x2, y2, {
      // stroke: "cyan",
    });
    switch (type) {
      case "rectangle":
      case "line":
        roughElement =
          type === "rectangle"
            ? generator.rectangle(x1, y1, x2 - x1, y2 - y1, {
                stroke: "cyan",
              })
            : generator.line(x1, y1, x2, y2, {
                stroke: "cyan",
              });
        return { x1, y1, x2, y2, type, roughElement };
      case "brush":
        return { id, type, points: [{ x: x1, y: y1 }] };
      case "text":
        return { id, x1, y1, type, text: "Hello world" };
      default:
        throw new Error("unknow tool");
        break;
    }
  };

  const handleMouseDown = (e: { clientX: any; clientY: any }) => {
    setDrawing(true);
    const { clientX, clientY } = e;
    const index = elements.length;
    const element = createElement(
      index,
      clientX,
      clientY,
      clientX,
      clientY,
      toolType
    );
    setElements((prvState) => [...prvState, element]);
  };

  const handleMouseMove = (e: { clientX: any; clientY: any }) => {
    if (!drawing) return;
    const index = elements.length - 1;
    const { x1, y1 } = elements[index];
    const { clientX, clientY } = e;

    const elementsCopy = [...elements];
    switch (toolType) {
      case "line":
      case "rectangle":
        elementsCopy[index] = createElement(
          index,
          x1,
          y1,
          clientX,
          clientY,
          toolType
        );
        break;
      case "brush":
        elementsCopy[index].points = [
          ...elements[index].points,
          { x: clientX, y: clientY },
        ];
        break;

      default:
        break;
    }
    setElements(elementsCopy);
  };

  const handleMouseLeave = () => {
    setDrawing(false);
  };

  const clearCanvas = () => {
    ctxRef.current?.clearRect(0, 0, window.innerWidth, window.innerHeight);
    setElements([]);
  };

  function getSvgPathFromStroke(stroke) {
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
  }

  const drawElement = (
    roughCanvas,
    { type, x1, y1, roughElement, points, text }
  ) => {
    switch (type) {
      case "line":
      case "rectangle":
        roughCanvas.draw(roughElement);
        break;
      case "brush":
        const stroke = getSvgPathFromStroke(getStroke(points, { size: 3 }));
        ctxRef.current.strokeStyle = "#FF0000";
        ctxRef.current.fill(new Path2D(stroke));
        break;
      case "text":
        ctxRef.current.font = "16px sans-serif";
        ctxRef.current.fillText(text, x1, y1);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (window) {
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
      const canvas = canvasRef.current;
      ctxRef.current = canvas.getContext("2d");
      ctxRef.current.fillStyle = "cyan";
      const roughCanvas = Rough.canvas(canvas);
      elements.map((element) => drawElement(roughCanvas, element));
    }
  }, [elements]);

  useEffect(() => {
    if (appState.selectedTool === "clear") {
      clearCanvas();
      updateAppState({ selectedTool: toolType });
      return;
    }
    setToolType(appState.selectedTool);
  }, [appState]);

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseLeave}
      onMouseLeave={handleMouseLeave}
    />
  );
}
