import React, { useContext, useEffect, useRef, useState } from "react";
import { useAppState } from "../context/appContext";
import { ICanvasTools } from "../interfaces";

export default function Canvas() {
  const appState = useAppState();
  const [toolType, setToolType] = useState<ICanvasTools>("brush");
  const [stroke, setStroke] = useState<number>(3);
  const [canUndo, setCanUndo] = useState<boolean>(false);
  const [canRedo, setReturn] = useState<boolean>(false);
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const canvasOffSetX = useRef(null);
  const canvasOffSetY = useRef(null);
  const startX = useRef(null);
  const startY = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);

  const startDrawingRectangle = ({nativeEvent}) => {
    nativeEvent.preventDefault();
    nativeEvent.stopPropagation();

    startX.current = nativeEvent.clientX - canvasOffSetX.current;
    startY.current = nativeEvent.clientY - canvasOffSetY.current;

    setIsDrawing(true);
};

const drawRectangle = ({nativeEvent}) => {
    if (!isDrawing) {
        return;
    }

    nativeEvent.preventDefault();
    nativeEvent.stopPropagation();

    const newMouseX = nativeEvent.clientX - canvasOffSetX.current;
    const newMouseY = nativeEvent.clientY - canvasOffSetY.current;

    const rectWidth = newMouseX - startX.current;
    const rectHeight = newMouseY - startY.current;

    ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    ctxRef.current.strokeRect(startX.current, startY.current, rectWidth, rectHeight);
};

const stopDrawingRectangle = () => {
    setIsDrawing(false);
};

  useEffect(() => {
    const canvas: HTMLCanvasElement = canvasRef?.current;
    if (canvas) {
      canvas.height = window.innerHeight;
      canvas.width = window.innerWidth;
      const canvasctx = canvas?.getContext("2d");
      canvasctx.lineCap = "round";
      canvasctx.strokeStyle = "cyan";
      canvasctx.lineWidth = 2;
      ctxRef.current = canvasctx;
      const canvasOffset = canvas.getBoundingClientRect();
      canvasOffSetX.current = canvasOffset.top;
      canvasOffSetY.current = canvasOffset.left;
    }
  }, []);

  // useEffect(() => {
  //   if(canvasRef){
  //     const canvas: HTMLCanvasElement = canvasRef?.current;
  //     const canvasctx = canvas?.getContext('2d');
  //   }
  //   if(window){
  //     window.addEventListener('mousemove',()=>{
  //       // console.log('====================================');
  //       // console.log("moved");
  //       // console.log('====================================');
  //     })
  //   }
  //   return () => {
  //     if(window){
  //       window.removeEventListener("mousemove",()=>{
  //       })
  //       window.removeEventListener("keyDown",()=>{
  //       })
  //     }
  //   }
  // }, [])

  useEffect(() => {
    console.log("====================================");
    console.log(appState);
    console.log("====================================");
  }, [appState]);

  return (
    <canvas
      ref={canvasRef}
      // className="canvas-draw"
      onMouseDown={startDrawingRectangle}
      onMouseMove={drawRectangle}
      onMouseUp={stopDrawingRectangle}
      onMouseLeave={stopDrawingRectangle}
    />
  );
}
