import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "./Button";

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
  initialFocusSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
}) {
  const titleId = useId();
  const panelRef = useRef(null);

  const widths = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
  };

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !panelRef.current) return;
    const el = panelRef.current.querySelector(initialFocusSelector);
    if (el && typeof el.focus === "function") el.focus();
  }, [isOpen, initialFocusSelector]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  return createPortal(
    <AnimatePresence>
      {isOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="presentation"
        >
          <motion.button
            type="button"
            aria-label="Fechar modal"
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            className={`relative z-10 w-full ${widths[size] || widths.md} rounded-2xl bg-white shadow-2xl`}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-4">
              {title ? (
                <h2 id={titleId} className="text-lg font-semibold text-sps-primary">
                  {title}
                </h2>
              ) : (
                <span className="sr-only">Diálogo</span>
              )}
              <Button
                type="button"
                variant="ghost"
                className="!min-h-0 !px-2 !py-1 text-sps-secondary hover:text-sps-primary"
                onClick={onClose}
                aria-label="Fechar"
              >
                <X className="h-5 w-5" aria-hidden />
              </Button>
            </div>
            <div className="max-h-[min(70vh,560px)] overflow-y-auto px-6 py-4">
              {children}
            </div>
            {footer ? (
              <div className="flex flex-col-reverse gap-2 border-t border-slate-100 px-6 py-4 sm:flex-row sm:justify-end">
                {footer}
              </div>
            ) : null}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
