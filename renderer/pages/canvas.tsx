import React, { useContext, useEffect, useRef, useState } from 'react'
import { useAppState } from '../context/appContext';
import { ICanvasTools } from '../interfaces';

export default function Canvas() {
  const appstate = useAppState();
  const [toolType,setToolType] = useState<ICanvasTools>('brush');
  const [stroke,setStroke] = useState<number>(3);
  const [canUndo,setCanUndo] = useState<boolean>(false);
  const [canRedo,setReturn] = useState<boolean>(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    if(canvasRef){
      console.log('====================================');
      console.log(appstate);
      console.log('====================================');
      const canvas: HTMLCanvasElement = canvasRef?.current;
      const canvasctx = canvas?.getContext('2d');
      console.log('====================================');
      console.log(canvasctx);
      console.log('====================================');
    }
    if(window){
      window.addEventListener('mousemove',()=>{
        console.log('====================================');
        console.log("moved");
        console.log('====================================');
      })
    }
    return () => {
      if(window){
        window.removeEventListener("mousemove",()=>{
        })
        window.removeEventListener("keyDown",()=>{
        })
      }
    }
  }, [])
  
  return (
    <div className='canvas-draw'>
      <canvas height={'100%'} width={'100%'} ref={canvasRef} />
    </div>
  )
}
