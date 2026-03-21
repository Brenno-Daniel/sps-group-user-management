import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { LogOut, User } from "lucide-react";
import { Button } from "../ui/Button";

const LOGO_URL =
  "https://www.spsgroup.com.br/wp-content/uploads/2024/03/SPSConstultoria_007.png";

export function AppLayout({ user, onLogout, children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const menuId = useId();
  const [menuPos, setMenuPos] = useState({
    top: 0,
    right: 0,
    width: 280,
  });

  useLayoutEffect(() => {
    if (!menuOpen) return;
    function update() {
      const el = triggerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const width = Math.min(280, window.innerWidth - 32);
      setMenuPos({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
        width,
      });
    }
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [menuOpen]);

  useEffect(() => {
    function onDocMouseDown(e) {
      if (!menuOpen) return;
      const inTrigger = triggerRef.current?.contains(e.target);
      const inMenu = menuRef.current?.contains(e.target);
      if (!inTrigger && !inMenu) setMenuOpen(false);
    }
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    function onKey(e) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const displayName = user?.name || user?.email || "Usuário";
  const email = user?.email || "";

  const menuPanel =
    menuOpen ? (
      <div
        ref={menuRef}
        id={menuId}
        role="menu"
        aria-label="Conta e sessão"
        style={{
          position: "fixed",
          top: menuPos.top,
          right: menuPos.right,
          width: menuPos.width,
          zIndex: 9999,
        }}
        className="overflow-hidden rounded-xl border border-slate-200/90 bg-white py-1 shadow-lg ring-1 ring-slate-900/5"
      >
        <div className="border-b border-slate-100 px-4 py-3" role="none">
          <p className="text-sm font-semibold text-sps-primary">
            Olá {displayName}
          </p>
          {email ? (
            <p className="mt-1 truncate text-xs text-slate-500" title={email}>
              {email}
            </p>
          ) : null}
        </div>
        <button
          type="button"
          role="menuitem"
          className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-medium text-sps-primary transition-colors hover:bg-slate-50 focus-visible:bg-slate-50 focus-visible:outline-none"
          onClick={() => {
            setMenuOpen(false);
            onLogout();
          }}
        >
          <LogOut className="h-4 w-4 shrink-0" aria-hidden />
          Sair
        </button>
      </div>
    ) : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-sps-brand/30 to-slate-50">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex min-w-0 max-w-6xl items-center justify-between gap-2 px-3 py-3 sm:gap-4 sm:px-6">
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
            <div className="flex h-12 w-[72px] shrink-0 items-center justify-center rounded-lg bg-sps-primary p-1 sm:h-14 sm:w-[88px]">
              <img
                src={LOGO_URL}
                alt="SPS Consultoria"
                width={185}
                height={103}
                className="h-full w-full object-contain"
              />
            </div>
            <div className="min-w-0 overflow-hidden">
              <p className="truncate text-sm font-semibold text-sps-primary sm:text-base">
                Sistema de Gerenciamento de Usuários
              </p>
              <p className="hidden text-xs text-sps-secondary sm:block">
                SPS Group
              </p>
            </div>
          </div>

          <div className="shrink-0">
            <Button
              ref={triggerRef}
              type="button"
              variant="icon"
              className="!rounded-full"
              aria-expanded={menuOpen}
              aria-haspopup="true"
              aria-controls={menuId}
              aria-label="Menu da conta"
              onClick={() => setMenuOpen((o) => !o)}
            >
              <User className="h-5 w-5" aria-hidden />
            </Button>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">{children}</div>
      {typeof document !== "undefined" && menuPanel
        ? createPortal(menuPanel, document.body)
        : null}
    </div>
  );
}
