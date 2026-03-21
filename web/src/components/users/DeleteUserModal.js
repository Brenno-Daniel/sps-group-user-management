import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { Modal, Button } from "../ui";
import { deleteUser } from "../../services/userApi";
import { messageFromAxiosError } from "../../utils/apiMessages";

export function DeleteUserModal({ isOpen, user, onClose, onDeleted }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleConfirm() {
    if (!user) return;
    setError("");
    setLoading(true);
    try {
      await deleteUser(user.id);
      onDeleted(user.id);
      onClose();
    } catch (err) {
      setError(messageFromAxiosError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Excluir usuário"
      size="sm"
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="button"
            className="bg-red-600 text-white hover:bg-red-700 hover:text-white"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? "Excluindo…" : "Excluir"}
          </Button>
        </>
      }
    >
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex gap-3"
      >
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600"
          aria-hidden
        >
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div>
          <p className="text-slate-700">
            Tem certeza que deseja excluir{" "}
            <strong className="text-slate-900">{user?.name}</strong> (
            {user?.email})?
          </p>
          <p className="mt-2 text-sm text-sps-secondary">Esta ação não pode ser desfeita.</p>
          {error ? (
            <p className="mt-3 text-sm text-red-600" role="alert">
              {error}
            </p>
          ) : null}
        </div>
      </motion.div>
    </Modal>
  );
}
