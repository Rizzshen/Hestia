import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

export default function Tooltip({ content, children }) {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);

  useEffect(() => {
    if (visible && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPos({
        top: rect.bottom + window.scrollY + 6,
        left: rect.left + window.scrollX + rect.width / 2,
      });
    }
  }, [visible]);

  return (
    <>
      <span
        ref={triggerRef}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        className="cursor-default"
      >
        {children}
      </span>
      {visible &&
        createPortal(
          <div
            className="fixed z-50 max-w-xs rounded-lg border border-border bg-surface shadow-lg px-3 py-2 text-xs text-text-muted leading-relaxed pointer-events-none"
            style={{
              top: pos.top,
              left: pos.left,
              transform: "translateX(-50%)",
            }}
          >
            {content}
          </div>,
          document.body,
        )}
    </>
  );
}
