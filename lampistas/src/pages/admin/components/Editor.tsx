import  { forwardRef, useEffect, useLayoutEffect, useRef } from "react";
import Quill, { Delta, Op } from "quill";
import "quill/dist/quill.snow.css";

// Editor is an uncontrolled React component
type EditorProps = {
  readOnly?: boolean;
  defaultValue?: Delta | Op[];
  onTextChange?: (...args: unknown[]) => void;
  onSelectionChange?: (...args: unknown[]) => void;
};

const Editor = forwardRef<Quill | null, EditorProps>(
  ({ readOnly, defaultValue, onTextChange, onSelectionChange }, ref) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const defaultValueRef = useRef(defaultValue);
    const onTextChangeRef = useRef(onTextChange);
    const onSelectionChangeRef = useRef(onSelectionChange);

    useLayoutEffect(() => {
      onTextChangeRef.current = onTextChange;
      onSelectionChangeRef.current = onSelectionChange;
    });

  
    useEffect(() => {
      const container = containerRef.current;
      if (!container) {
        return;
      }

      const editorContainer = container.appendChild(
        container.ownerDocument.createElement("div"),
      );
      const quill = new Quill(editorContainer, {
        theme: "snow",
        readOnly: readOnly ?? false,
      });

      if (typeof ref === "function") {
        ref(quill);
      } else if (ref) {
        ref.current = quill;
      }

      if (defaultValueRef.current) {
        quill.setContents(defaultValueRef.current );
      }

      quill.on("text-change", (...args) => {
        onTextChangeRef.current?.(...args);
      });

      quill.on("selection-change", (...args) => {
        onSelectionChangeRef.current?.(...args);
      });

      return () => {
        if (typeof ref === "function") {
          ref(null);
        } else if (ref) {
          ref.current = null;
        }
        container.innerHTML = "";
      };
    }, []);

    return <div ref={containerRef}></div>;
  },
);

Editor.displayName = "Editor";

export default Editor;