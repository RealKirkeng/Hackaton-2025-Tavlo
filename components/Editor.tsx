

import React, { useRef, useEffect, useState, useLayoutEffect } from 'react';
import { Tool } from '../App';

interface EditorProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  activeTool: Tool;
  drawingData: string;
  onDrawingChange: (data: string) => void;
  penColor: string;
  penSize: number;
}

const Editor: React.FC<EditorProps> = ({ value, onChange, activeTool, drawingData, onDrawingChange, penColor, penSize }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const getCanvasContext = (canvas: HTMLCanvasElement | null) => {
    if (!canvas) return null;
    return canvas.getContext('2d');
  };

  // Resize canvas to fit container and load initial drawing
  useLayoutEffect(() => {
    const container = containerRef.current;
    const mainCanvas = canvasRef.current;
    if (container && mainCanvas) {
      mainCanvas.width = container.offsetWidth;
      mainCanvas.height = container.offsetHeight;
      
      const ctx = getCanvasContext(mainCanvas);
      if (ctx) {
        ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
        if (drawingData) {
          const img = new Image();
          img.onload = () => {
            ctx.drawImage(img, 0, 0);
          };
          img.src = drawingData;
        }
      }
    }
  }, [drawingData]);
  
  const configureContext = (ctx: CanvasRenderingContext2D | null) => {
    if (!ctx) return;
    
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    switch(activeTool) {
      case 'pencil':
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = penColor;
        ctx.lineWidth = penSize;
        ctx.globalAlpha = 1.0;
        break;
      case 'eraser':
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = 25;
        break;
      default:
        break;
    }
  }

  // Set drawing styles based on active tool
  useEffect(() => {
    configureContext(getCanvasContext(canvasRef.current));
  }, [activeTool, penColor, penSize]);

  const getCoords = (event: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    if ('touches' in event) {
        return {
            x: event.touches[0].clientX - rect.left,
            y: event.touches[0].clientY - rect.top
        };
    }
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
  };

  const startDrawing = (event: React.MouseEvent | React.TouchEvent) => {
    if (activeTool === 'text') return;
    
    const { x, y } = getCoords(event);
    const ctx = getCanvasContext(canvasRef.current);
    if (!ctx) return;
    
    // FIX: Re-apply context settings at the start of each stroke.
    // This prevents the context from resetting after the canvas is cleared.
    configureContext(ctx);
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (event: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const { x, y } = getCoords(event);
    
    const ctx = getCanvasContext(canvasRef.current);
    if (!ctx) return;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    const mainCanvas = canvasRef.current;
    if (!mainCanvas) return;

    const ctx = getCanvasContext(mainCanvas);
    ctx?.closePath();
    
    setIsDrawing(false);
    onDrawingChange(mainCanvas.toDataURL());
  };

  const isDrawingToolActive = activeTool !== 'text';

  return (
    <div ref={containerRef} className="w-full h-full">
      <textarea
        className="absolute top-0 left-0 w-full h-full bg-transparent border-none focus:ring-0 resize-none font-serif text-xl md:text-2xl text-gray-800 leading-loose disabled:text-gray-800"
        value={value}
        onChange={onChange}
        placeholder="Start writing..."
        disabled={isDrawingToolActive}
        style={{ pointerEvents: isDrawingToolActive ? 'none' : 'auto', zIndex: 0 }}
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        style={{ 
          pointerEvents: isDrawingToolActive ? 'auto' : 'none', 
          touchAction: 'none',
          zIndex: 1
        }}
      />
    </div>
  );
};

export default Editor;