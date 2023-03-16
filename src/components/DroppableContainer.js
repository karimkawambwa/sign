import React, { useRef, useState } from 'react';
import { useDrop } from 'react-dnd';
import { DraggableField } from './DraggableField';
import { FieldTypes } from './FieldTypes';

const fields = [];

export const DroppableContainer = ({ children }) => {
  const ref = useRef();
  const [fields, setFields] = useState([]);

  const [{ isOver }, drop] = useDrop({
    accept: FieldTypes.INPUT,
    drop: (item, monitor) => {
    const dropTargetPosition = ref.current.getBoundingClientRect();

    const { y: finalY, x: finalX } = monitor.getSourceClientOffset();
    const { y: initialY, x: initialX } = monitor.getInitialSourceClientOffset();
    
    // calculate the correct position removing the viewport position.
   // finalY > initialY, I'm dragging down, otherwise, dragging up
    const newYposition =
      finalY > initialY
        ? initialY + (finalY - initialY) - dropTargetPosition.top
        : initialY - (initialY - finalY) - dropTargetPosition.top;

    const newXposition =
      finalX > initialX
        ? initialX + (finalX - initialX) - dropTargetPosition.left
        : initialX - (initialX - finalX) - dropTargetPosition.left;

    setFields(prev => {
      const found = prev.find(({ id }) => id === item.id);
      if (found) {
        found.x = newXposition;
        found.y = newYposition;

        return prev;
      } 
        return prev.concat([{
          id: item.id,
          x: newXposition,
          y: newYposition,
         }]);
    });
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const dropTargetPosition = ref.current?.getBoundingClientRect() || {};

  return (
    <div ref={function(n) {
      drop.call(this, ...arguments);
      if (!ref.current) {
        ref.current = n;
      }
    }} style={{ backgroundColor: isOver ? 'lightgray' : 'white' }}>
      {fields.map(({ id, x, y }) => <DraggableField key={id} id={id} x={x + dropTargetPosition.left} y={y + dropTargetPosition.y} />)}
      {children}
    </div>
  );
};
