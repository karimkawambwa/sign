import React,  { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Document, Page, pdfjs } from 'react-pdf';
import { DraggableField } from "./components/DraggableField";
import { DroppableContainer } from "./components/DroppableContainer";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function useBlob(url) {
  const [blob, setBlob] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(url);
      const data = await response.blob();
      setBlob(data);
    };
    fetchData();
  }, [url]);

  return { blob, url: blob && URL.createObjectURL(blob) };
}

function App() {
  const { url } = useBlob("https://corsproxy.io/?https%3A%2F%2Fwww.irs.gov%2Fpub%2Firs-pdf%2Ffw8ben.pdf");
  return (
    <DndProvider backend={HTML5Backend}>
    <div style={{ display: "flex", flexDirection: "row" }}>

    <div>
      
    <DraggableField />
      </div>
   
      <div>
          {url && <Document file={url}>
            <DroppableContainer>
            <Page pageNumber={1} />
            </DroppableContainer>
          </Document>}
    </div>
    </div>
    </DndProvider>
  );
}

export default App;
