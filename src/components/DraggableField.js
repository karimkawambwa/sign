import React, { useRef, useState } from 'react';
import { useDrag } from 'react-dnd';
import { Resizable } from 'react-resizable';
import 'react-resizable/css/styles.css';
import { FieldTypes } from './FieldTypes';
import { nanoid } from "nanoid";

export const DraggableField = ({ id, x, y, width: propWidth = 150, height: propHeight = 20 }) => {
  const ref = useRef();

  const [{ width, height }, setSize] = useState({
    width: propWidth, height: propHeight
  })

  const [{ isDragging }, drag, dragPreview] = useDrag({
    type: FieldTypes.INPUT,
    item: {
      id: id || nanoid(),
        getBoundingBox: () => ref.current.getBoundingClientRect(),
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <Resizable height={height} width={width} onResize={(_, {size}) => {
      setSize(size);
    }} resizeHandles={['sw', 'se', 'nw', 'ne', 'w', 'e', 'n', 's']}>
    <div 
      ref={function (n) {
        dragPreview.call(this, ...arguments);
        drag.call(this, ...arguments);
        if (!ref.current ) {
            ref.current = n;
        }
      }}
      style={{ 
        opacity: isDragging ? 0.5 : 1,
        position: x & y ? "absolute" : "relative",
        zIndex: isDragging ? 999 : 998,
        left: x,
        top: y,
        width,
        height,
        padding: "8px",
        border: "orange 2px solid"
      }}>
    <input
      type="text"
      style={{ position: "relative"  }}
    />
      </div>
    </Resizable>
  );
};
