import getStroke from "perfect-freehand";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import rough from "roughjs/bundled/rough.cjs";
import { useAppState, useUpdateAppState } from "../context/appContext";
import { useHistory } from "../hooks/useHistory";
import { ICanvasTools } from "../interfaces";

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
  const generator = rough.generator();

  const createElement = (id, x1, y1, x2, y2, type, options) => {
    switch (type) {
      case "line":
        return {
          id,
          x1,
          y1,
          x2,
          y2,
          type,
          roughElement: generator.line(x1, y1, x2, y2, options),
        };
      case "rectangle":
        return {
          id,
          x1,
          y1,
          x2,
          y2,
          type,
          roughElement: generator.rectangle(x1, y1, x2 - x1, y2 - y1, options),
        };
      case "circle":
        return {
          id,
          x1,
          y1,
          x2,
          y2,
          type,
          roughElement: generator.circle(x1, y1, x2 - x1, options),
        };
      case "brush":
      case "eraser":
        return { id, type, points: [{ x: x1, y: y1 }], options };
      case "text":
        return { id, type, x1, y1, x2, y2, text: "", options };
      default:
        throw new Error(`Type not recognised: ${type}`);
    }
  };

  const nearPoint = (x, y, x1, y1, name) => {
    return Math.abs(x - x1) < 5 && Math.abs(y - y1) < 5 ? name : null;
  };

  const onLine = (x1, y1, x2, y2, x, y, maxDistance = 1) => {
    const a = { x: x1, y: y1 };
    const b = { x: x2, y: y2 };
    const c = { x, y };
    const offset = distance(a, b) - (distance(a, c) + distance(b, c));
    return Math.abs(offset) < maxDistance ? "inside" : null;
  };

  const positionWithinElement = (x, y, element) => {
    const { type, x1, x2, y1, y2 } = element;
    switch (type) {
      case "line":
        const on = onLine(x1, y1, x2, y2, x, y);
        const start = nearPoint(x, y, x1, y1, "start");
        const end = nearPoint(x, y, x2, y2, "end");
        return start || end || on;
      case "circle":
        // return x >= x1 && x <= x2 && y >= y1 && y <= y2
        return x <= x2 && x >= -(x1 - x2) && y >= y2 && y <= -(y1 - y2)
          ? "inside"
          : null;
      case "rectangle":
        const topLeft = nearPoint(x, y, x1, y1, "tl");
        const topRight = nearPoint(x, y, x2, y1, "tr");
        const bottomLeft = nearPoint(x, y, x1, y2, "bl");
        const bottomRight = nearPoint(x, y, x2, y2, "br");
        const inside =
          x >= x1 && x <= x2 && y >= y1 && y <= y2 ? "inside" : null;
        return topLeft || topRight || bottomLeft || bottomRight || inside;
      case "brush":
      case "eraser":
        const betweenAnyPoint = element.points.some((point, index) => {
          const nextPoint = element.points[index + 1];
          if (!nextPoint) return false;
          return (
            onLine(point.x, point.y, nextPoint.x, nextPoint.y, x, y, 5) != null
          );
        });
        return betweenAnyPoint ? "inside" : null;
      case "text":
        return x >= x1 && x <= x2 && y >= y1 && y <= y2 ? "inside" : null;
      default:
        throw new Error(`Type not recognised: ${type}`);
    }
  };

  const distance = (a, b) =>
    Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

  const getElementAtPosition = (x, y, elements) => {
    return elements
      .map((element) => ({
        ...element,
        position: positionWithinElement(x, y, element),
      }))
      .find((element) => element.position !== null);
  };

  const adjustElementCoordinates = (element) => {
    const { type, x1, y1, x2, y2 } = element;
    if (type === "rectangle") {
      const minX = Math.min(x1, x2);
      const maxX = Math.max(x1, x2);
      const minY = Math.min(y1, y2);
      const maxY = Math.max(y1, y2);
      return { x1: minX, y1: minY, x2: maxX, y2: maxY };
    } else {
      if (x1 < x2 || (x1 === x2 && y1 < y2)) {
        return { x1, y1, x2, y2 };
      } else {
        return { x1: x2, y1: y2, x2: x1, y2: y1 };
      }
    }
  };

  const cursorForPosition = (position) => {
    switch (position) {
      case "tl":
      case "br":
      case "start":
      case "end":
        return "nwse-resize";
      case "tr":
      case "bl":
        return "nesw-resize";
      default:
        return "move";
    }
  };

  const resizedCoordinates = (clientX, clientY, position, coordinates) => {
    const { x1, y1, x2, y2 } = coordinates;
    switch (position) {
      case "tl":
      case "start":
        return { x1: clientX, y1: clientY, x2, y2 };
      case "tr":
        return { x1, y1: clientY, x2: clientX, y2 };
      case "bl":
        return { x1: clientX, y1, x2, y2: clientY };
      case "br":
      case "end":
        return { x1, y1, x2: clientX, y2: clientY };
      default:
        return null; //should not really get here...
    }
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

  const drawElement = (roughCanvas, context, element) => {
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
            size: appState.stroke,
          })
        );
        context.fillStyle =
          element.type === "eraser" ? "#00000042" : appState.activeColor;
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
      rundoEnabled: undoEnabled(),
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
        // const options = {
        //   stroke: appState.activeColor,
        //   strokeWidth: appState.stroke,
        //   fill: appState.fill ? appState.activeColor : "",
        // };
        elementsCopy[id] = createElement(id, x1, y1, x2, y2, type, options);
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
            ...createElement(
              id,
              x1,
              y1,
              x1 + textWidth,
              y1 + textHeight,
              type,
              options
            ),
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
      const id = elements.length;
      const options = {
        stroke: appState.activeColor,
        strokeWidth: appState.stroke,
        fill: appState.fill ? appState.activeColor : "",
        fillWeight: appState.stroke, // thicker lines for hachure
      };
      const element = createElement(
        id,
        clientX,
        clientY,
        clientX,
        clientY,
        tool,
        options
      );
      setElements((prevState) => [...prevState, element]);
      setSelectedElement(element);
      setAction(tool === "text" ? "writing" : "drawing");
    }
  };

  const handleMouseMove = (event) => {
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
        const { id, x1, x2, y1, y2, type, offsetX, offsetY } = selectedElement;
        const width = x2 - x1;
        const height = y2 - y1;
        const newX1 = clientX - offsetX;
        const newY1 = clientY - offsetY;
        const options =
          type === "text" ? { text: selectedElement.text } : { text: "" };
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

  useEffect(() => {
    if (window) {
      const canvas: HTMLCanvasElement = canvasRef.current;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const context: any = canvas.getContext("2d");
      ctxRef.current = context;

      const roughCanvas = rough.canvas(canvas);

      elements.forEach((element) => {
        if (action === "writing" && selectedElement.id === element.id) return;
        drawElement(roughCanvas, context, element);
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
      <canvas
        ref={canvasRef}
        id="canvas"
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
