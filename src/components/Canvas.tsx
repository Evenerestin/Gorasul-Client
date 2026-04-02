import {
  IconArrowBackUp,
  IconBrush,
  IconCheck,
  IconChevronRight,
  IconColorPicker,
  IconEraser,
  IconImageInPicture,
  IconPolaroid,
  IconTrash,
  IconX
} from '@tabler/icons-react';
import Konva from 'konva';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Image as ReactImage, Layer as ReactLayer, Stage, Transformer } from 'react-konva';
import { useTheme } from '../contexts/ThemeContext';
import BrushOptions from './BrushOptions';
import { default as ColorPalette } from './ColorPalette';

export type ModalType = 'save-success' | 'save-error' | 'clear-file' | 'clear-canvas' | null;
export type CanvasShape = 'circle' | 'egg';

const SHAPE_CONFIG = {
  circle: { width: 400, height: 400, borderRadius: '50%' },
  egg: { width: 350, height: 450, borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%' }
};

const Canvas = ({
  savePainting,
  activeModal,
  setActiveModal,
  shape = 'circle',
  swatches
}: {
  savePainting: (data: string) => void;
  activeModal: ModalType;
  setActiveModal: React.Dispatch<React.SetStateAction<ModalType>>;
  shape?: CanvasShape;
  swatches?: string[];
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stageRef = useRef<any>(null);
  const transformerRef = useRef<any>(null);
  const imageRef = useRef<any>(null);
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  const [isOverCanvas, setIsOverCanvas] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [tool, setTool] = useState('brush');
  const [file, setFile] = useState<File | null>(null);
  const [editMode, setEditMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageLayers, setImageLayers] = useState<
    Array<{
      id: string;
      image: HTMLImageElement;
      x: number;
      y: number;
      width: number;
      height: number;
    }>
  >([]);

  const undoStackRef = useRef<ImageData[]>([]);
  const [canUndo, setCanUndo] = useState(false);

  const { colorScheme } = useTheme();
  const getBackgroundColor = useCallback(
    () => (colorScheme === 'light' ? '#e9ecef' : '#141414'),
    [colorScheme]
  );
  const { width: canvasWidth, height: canvasHeight, borderRadius } = SHAPE_CONFIG[shape];

  const saveSnapshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    undoStackRef.current = [...undoStackRef.current.slice(-29), snapshot];
    setCanUndo(true);
  };

  const undo = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const stack = undoStackRef.current;
    if (stack.length === 0) return;
    const prev = stack.pop()!;
    ctx.putImageData(prev, 0, 0);
    setCanUndo(stack.length > 0);
  };

  const clearFile = () => {
    setFile(null);
    setImageLayers([]);
    setEditMode(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    clearCanvas();

    if (imageRef.current) {
      imageRef.current = null;
    }
    if (transformerRef.current) {
      transformerRef.current.nodes([]);
      transformerRef.current.getLayer().batchDraw();
    }

    if (stageRef.current) {
      const stage = stageRef.current;
      stage.find('Image').forEach((node: Konva.Node) => node.destroy());
      stage.draw();
    }
  };

  const pickColor = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const hexColor = `#${pixel[0].toString(16).padStart(2, '0')}${pixel[1]
      .toString(16)
      .padStart(2, '0')}${pixel[2].toString(16).padStart(2, '0')}`;
    setColor(hexColor);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (tool === 'colorPicker') {
      pickColor(e);
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Save snapshot before starting this stroke
    saveSnapshot();

    const bg = getBackgroundColor();
    ctx.strokeStyle = tool === 'eraser' ? bg : color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    let lastX = e.nativeEvent.offsetX;
    let lastY = e.nativeEvent.offsetY;

    // Draw a dot for single clicks
    ctx.beginPath();
    ctx.arc(lastX, lastY, brushSize / 2, 0, Math.PI * 2);
    ctx.fillStyle = tool === 'eraser' ? bg : color;
    ctx.fill();

    const draw = (event: MouseEvent) => {
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(event.offsetX, event.offsetY);
      ctx.stroke();
      lastX = event.offsetX;
      lastY = event.offsetY;
    };

    const stopDrawing = () => {
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mouseleave', stopDrawing);
    };

    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);
  };

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bg = getBackgroundColor();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, [getBackgroundColor]);

  // Repaint canvas background when theme changes
  useEffect(() => {
    clearCanvas();
  }, [clearCanvas]);

  const saveCanvasPainting = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bg = getBackgroundColor();
    const currentImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    const blankCanvas = document.createElement('canvas');
    blankCanvas.width = canvas.width;
    blankCanvas.height = canvas.height;
    const blankCtx = blankCanvas.getContext('2d');
    if (!blankCtx) return;

    blankCtx.fillStyle = bg;
    blankCtx.fillRect(0, 0, canvas.width, canvas.height);
    const blankImageData = blankCtx.getImageData(0, 0, canvas.width, canvas.height);

    const hasDrawing = !currentImageData.data.every((val, i) => val === blankImageData.data[i]);

    if (!hasDrawing && imageLayers.length === 0) {
      return;
    }

    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = canvas.width;
    finalCanvas.height = canvas.height;
    const finalCtx = finalCanvas.getContext('2d');
    if (!finalCtx) return;

    if (imageLayers.length > 0 && stageRef.current) {
      // Clear transformer handles before capture so outlines aren't baked in
      if (transformerRef.current) {
        transformerRef.current.nodes([]);
        transformerRef.current.getLayer()?.batchDraw();
      }
      const stageDataURL = stageRef.current.toDataURL({
        mimeType: 'image/png'
      });
      const stageImage = new Image();
      stageImage.onload = () => {
        finalCtx.drawImage(stageImage, 0, 0);
        finalCtx.drawImage(canvas, 0, 0);
        exportFinalImage(finalCanvas);
      };
      stageImage.src = stageDataURL;
    } else {
      exportFinalImage(canvas);
    }
  };

  const exportFinalImage = (canvasToExport: HTMLCanvasElement) => {
    const stage = new Konva.Stage({
      container: document.createElement('div'),
      width: canvasToExport.width,
      height: canvasToExport.height
    });

    const layer = new Konva.Layer();
    stage.add(layer);

    const image = new Konva.Image({
      image: canvasToExport,
      x: 0,
      y: 0,
      width: canvasToExport.width,
      height: canvasToExport.height
    });
    layer.add(image);
    layer.draw();

    const dataURL = stage.toDataURL({
      mimeType: 'image/png',
      quality: 1,
      pixelRatio: 2
    });

    stage.destroy();
    savePainting(dataURL);
  };

  const handleFileInput = (selectedFile: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target?.result as string;
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const maxWidth = 250;
        const maxHeight = 250;
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const aspectRatio = width / height;
          if (width > maxWidth) {
            width = maxWidth;
            height = width / aspectRatio;
          }
          if (height > maxHeight) {
            height = maxHeight;
            width = height * aspectRatio;
          }
        }

        const x = (canvasWidth - width) / 2;
        const y = (canvasHeight - height) / 2;

        setImageLayers([
          {
            id: `layer-${Date.now()}`,
            image: img,
            x,
            y,
            width,
            height
          }
        ]);
      };
      img.onerror = () => {
        console.error('Failed to load image');
      };
    };
    reader.readAsDataURL(selectedFile);
  };

  const removeImage = () => {
    setImageLayers([]);
    setEditMode(false);
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (transformerRef.current) {
      transformerRef.current.nodes([]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  };

  const selectImage = () => {
    setEditMode(true);
    if (imageRef.current && transformerRef.current) {
      transformerRef.current.nodes([imageRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  };

  const flattenImageToCanvas = () => {
    // Just exit edit mode — the Konva layer stays and is merged at save time
    setEditMode(false);
    if (transformerRef.current) {
      transformerRef.current.nodes([]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  };

  useEffect(() => {
    if (editMode && imageRef.current && transformerRef.current) {
      transformerRef.current.nodes([imageRef.current]);
      transformerRef.current.getLayer().batchDraw();
    } else if (!editMode && transformerRef.current) {
      transformerRef.current.nodes([]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [editMode]);

  // Custom cursor tracking — use fixed positioning with clientX/clientY
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  // Track whether cursor is over the canvas area
  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;
    const enter = () => setIsOverCanvas(true);
    const leave = () => setIsOverCanvas(false);
    container.addEventListener('mouseenter', enter);
    container.addEventListener('mouseleave', leave);
    return () => {
      container.removeEventListener('mouseenter', enter);
      container.removeEventListener('mouseleave', leave);
    };
  }, []);

  const toolBtnClass = (active: boolean) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      active
        ? 'bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800'
        : 'border border-gray-200 dark:border-neutral-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700'
    }`;

  const getCursorIcon = () => {
    if (tool === 'eraser')
      return <IconEraser size={18} className="text-gray-600 dark:text-gray-300" />;
    if (tool === 'colorPicker')
      return <IconColorPicker size={18} className="text-gray-600 dark:text-gray-300" />;
    return null;
  };

  const cursorSize = tool === 'brush' || tool === 'eraser' ? Math.max(brushSize, 8) : 24;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Custom cursor — only visible when hovering canvas */}
      <div
        ref={cursorRef}
        className="pointer-events-none z-100"
        style={{
          position: 'fixed',
          width: `${cursorSize}px`,
          height: `${cursorSize}px`,
          borderRadius: tool === 'brush' || tool === 'eraser' ? '50%' : '0',
          border:
            tool === 'brush'
              ? `2px solid ${colorScheme === 'light' ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.7)'}`
              : tool === 'eraser'
                ? `2px solid ${colorScheme === 'light' ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.4)'}`
                : 'none',
          backgroundColor:
            tool === 'brush' ? color : tool === 'eraser' ? getBackgroundColor() : 'transparent',
          display: isOverCanvas && !editMode ? 'flex' : 'none',
          alignItems: 'center',
          justifyContent: 'center',
          transform: 'translate(-50%, -50%)',
          opacity: 0.9
        }}
      >
        {getCursorIcon()}
      </div>

      <div className="flex flex-col gap-6">
        {/* Canvas area */}
        <div className="flex flex-col items-center gap-4">
          <div
            ref={canvasContainerRef}
            className="relative"
            style={{
              width: canvasWidth + 10,
              height: canvasHeight + 10,
              cursor: isOverCanvas && !editMode ? 'none' : 'default'
            }}
          >
            {/* Drawing canvas — rendered first (bottom layer) */}
            <canvas
              ref={canvasRef}
              width={canvasWidth}
              height={canvasHeight}
              style={{
                border: `5px solid ${colorScheme === 'light' ? '#fff' : '#1a1b1e'}`,
                borderRadius,
                display: 'block',
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 1,
                pointerEvents: editMode ? 'none' : 'auto',
                cursor: 'none'
              }}
              onMouseDown={handleMouseDown}
            />

            {/* Konva layer for uploaded images — rendered on top */}
            {imageLayers.length > 0 && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  zIndex: 2,
                  pointerEvents: editMode ? 'auto' : 'none',
                  borderRadius,
                  overflow: 'hidden',
                  width: canvasWidth + 10,
                  height: canvasHeight + 10
                }}
              >
                <Stage
                  ref={stageRef}
                  width={canvasWidth}
                  height={canvasHeight}
                  style={{ position: 'absolute', top: 5, left: 5 }}
                >
                  <ReactLayer>
                    {imageLayers.map((layer) => (
                      <React.Fragment key={layer.id}>
                        <ReactImage
                          ref={imageRef}
                          image={layer.image}
                          x={layer.x}
                          y={layer.y}
                          width={layer.width}
                          height={layer.height}
                          draggable={editMode}
                          onClick={(e) => {
                            if (transformerRef.current && editMode) {
                              transformerRef.current.nodes([e.target]);
                              transformerRef.current.getLayer().batchDraw();
                            }
                          }}
                        />
                      </React.Fragment>
                    ))}
                    <Transformer ref={transformerRef} visible={editMode} />
                  </ReactLayer>
                </Stage>
              </div>
            )}
          </div>

          {/* Image upload row — below canvas */}
          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg"
              className="hidden"
              onChange={(e) => {
                const selectedFile = e.target.files?.[0] ?? null;
                setFile(selectedFile);
                if (selectedFile) handleFileInput(selectedFile);
              }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${
                file
                  ? 'bg-red-600 text-white border-red-600'
                  : 'border-gray-200 dark:border-neutral-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700'
              }`}
            >
              <IconPolaroid size={16} />
              {file ? file.name : 'Wstaw obraz'}
            </button>
            {file && (
              <>
                {!editMode ? (
                  <button
                    onClick={selectImage}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border border-gray-200 dark:border-neutral-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
                  >
                    <IconImageInPicture size={16} />
                    Edytuj
                  </button>
                ) : (
                  <button
                    onClick={flattenImageToCanvas}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800 transition-colors"
                  >
                    <IconCheck size={16} />
                    Gotowe
                  </button>
                )}
                <button
                  onClick={removeImage}
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                  title="Usuń obraz"
                >
                  <IconX size={16} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Tools, brush, palette */}
        <div className="flex flex-col gap-4 w-full">
          {/* Toolbar */}
          <div className="rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-4 shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              <button
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                onClick={() => setActiveModal('clear-canvas')}
                title="Wyczyść płótno"
              >
                <IconTrash size={16} />
              </button>
              <button
                className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors ${
                  canUndo
                    ? 'bg-gray-200 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-neutral-600'
                    : 'bg-gray-100 dark:bg-neutral-800 text-gray-400 dark:text-neutral-600 cursor-not-allowed'
                }`}
                onClick={undo}
                disabled={!canUndo}
                title="Cofnij"
              >
                <IconArrowBackUp size={16} />
              </button>

              <div className="w-px h-8 bg-gray-200 dark:bg-neutral-700 mx-1" />

              <button onClick={() => setTool('brush')} className={toolBtnClass(tool === 'brush')}>
                <IconBrush size={16} />
                <span className="hidden sm:inline">Pędzel</span>
              </button>
              <button onClick={() => setTool('eraser')} className={toolBtnClass(tool === 'eraser')}>
                <IconEraser size={16} />
                <span className="hidden sm:inline">Gumka</span>
              </button>
              <button
                onClick={() => setTool('colorPicker')}
                className={toolBtnClass(tool === 'colorPicker')}
              >
                <IconColorPicker size={16} />
                <span className="hidden sm:inline">Pobierz kolor</span>
              </button>

              <div className="flex-1" />

              <button
                onClick={saveCanvasPainting}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Zapisz
                <IconChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Brush size */}
          <div className="rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-5 shadow-sm">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
              Rozmiar pędzla
            </h3>
            <BrushOptions brushSize={brushSize} setBrushSize={setBrushSize} />
          </div>

          {/* Color palette */}
          <div className="rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-5 shadow-sm">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
              Paleta kolorów
            </h3>
            <ColorPalette color={color} setColor={setColor} swatches={swatches} />
          </div>
        </div>
      </div>

      {/* Clear canvas modal */}
      {activeModal === 'clear-canvas' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="bg-white dark:bg-neutral-800 rounded-xl p-6 max-w-sm w-full mx-4 shadow-xl border border-gray-200 dark:border-neutral-700"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Wyczyścić płótno?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Jesteś pewien, że chcesz wyczyścić całe płótno? Tej akcji nie można cofnąć.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-neutral-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors font-medium"
              >
                Anuluj
              </button>
              <button
                onClick={() => {
                  clearCanvas();
                  clearFile();
                  setActiveModal(null);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Wyczyść
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Canvas;
