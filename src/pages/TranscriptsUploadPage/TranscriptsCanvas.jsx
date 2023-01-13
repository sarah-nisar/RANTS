import React from "react";

const Canvas = ({ entry, draw, height, width }) => {
    const canvas = React.useRef();
  
    React.useEffect(() => {
      const context = canvas.current.getContext("2d");
      draw(context, entry);
    });
  
    
    return <canvas className="templateCanvas" ref={canvas} height={height} width={width} />;
};

export default Canvas;