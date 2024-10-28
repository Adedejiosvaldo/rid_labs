// // SignaturePad.tsx
// import React, { useRef, useEffect } from "react";

// interface SignaturePadProps {
//   onChange: (signature: string) => void;
// }

// const SignaturePad: React.FC<SignaturePadProps> = ({ onChange }) => {
//   const canvasRef = useRef<HTMLCanvasElement | null>(null);
//   const contextRef = useRef<CanvasRenderingContext2D | null>(null);
//   const [isDrawing, setIsDrawing] = React.useState(false);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (canvas) {
//       canvas.width = canvas.offsetWidth;
//       canvas.height = canvas.offsetHeight;
//       const context = canvas.getContext("2d");
//       if (context) {
//         context.lineCap = "round";
//         context.strokeStyle = "black";
//         context.lineWidth = 2;
//         contextRef.current = context;
//       }
//     }
//   }, []);

//   const startDrawing = (event: React.MouseEvent<HTMLCanvasElement>) => {
//     setIsDrawing(true);
//     contextRef.current?.beginPath();
//     contextRef.current?.moveTo(
//       event.nativeEvent.offsetX,
//       event.nativeEvent.offsetY
//     );
//   };

//   const draw = (event: React.MouseEvent<HTMLCanvasElement>) => {
//     if (!isDrawing) return;
//     contextRef.current?.lineTo(
//       event.nativeEvent.offsetX,
//       event.nativeEvent.offsetY
//     );
//     contextRef.current?.stroke();
//   };

//   const stopDrawing = () => {
//     setIsDrawing(false);
//     contextRef.current?.closePath();
//     // Convert canvas to image data URL
//     if (canvasRef.current) {
//       const signature = canvasRef.current.toDataURL();
//       onChange(signature); // Pass the signature to the parent component
//     }
//   };

//   return (
//     <canvas
//       ref={canvasRef}
//       onMouseDown={startDrawing}
//       onMouseMove={draw}
//       onMouseUp={stopDrawing}
//       onMouseLeave={stopDrawing}
//       style={{ border: "1px solid black", width: "100%", height: "200px" }}
//     />
//   );
// };

// export default SignaturePad;
// SignaturePad.tsx
import { Button } from "@nextui-org/button";
import { Divider } from "@nextui-org/react";
import React, { useRef, useEffect } from "react";

interface SignaturePadProps {
  onChange: (signature: string) => void;
}

const SignaturePad: React.FC<SignaturePadProps> = ({ onChange }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = React.useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const context = canvas.getContext("2d");
      if (context) {
        context.lineCap = "round";
        context.strokeStyle = "black";
        context.lineWidth = 2;
        contextRef.current = context;
      }
    }
  }, []);

  const startDrawing = (event: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    contextRef.current?.beginPath();
    contextRef.current?.moveTo(
      event.nativeEvent.offsetX,
      event.nativeEvent.offsetY
    );
  };

  const draw = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    contextRef.current?.lineTo(
      event.nativeEvent.offsetX,
      event.nativeEvent.offsetY
    );
    contextRef.current?.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    contextRef.current?.closePath();
    // Convert canvas to image data URL
    if (canvasRef.current) {
      const signature = canvasRef.current.toDataURL();
      onChange(signature); // Pass the signature to the parent component
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      context?.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
      onChange(""); // Clear the signature state in the parent component
    }
  };

  return (
    <div className="mt-3">
      {/* <Divider className="mb-3" /> */}
      <div className=""></div>
      <h3 className="font-bold text-center font-poppins mt-4 mb-2">
        Add Your Signature
      </h3>
      <canvas   
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        style={{ border: "1px solid black", width: "100%", height: "200px" }}
      />
      <div className="flex justify-end">
        <Button
          onClick={clearCanvas}
          className="mb-4 text-white"
          color="warning"
          style={{ marginTop: "10px" }}
        >
          Clear Signature
        </Button>
      </div>
      <Divider className="mb-3" />
    </div>
  );
};

export default SignaturePad;
