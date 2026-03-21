import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Modal, Button, Input, Select } from "../ui";
import { updateUser } from "../../services/userApi";
import { messageFromAxiosError } from "../../utils/apiMessages";
import { validateEditUserForm } from "../../utils/userFormValidation";
import { USER_TYPE_OPTIONS } from "./userTypes";

export function EditUserModal({ isOpen, user, onClose, onUpdated }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    type: "user",
    password: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    setForm({
      name: user.name || "",
      email: user.email || "",
      type: user.type || "user",
      password: "",
    });
    setFieldErrors({});
    setError("");
  }, [user, isOpen]);

  function handleClose() {
    setFieldErrors({});
    setError("");
    onClose();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!user) return;
    setError("");
    const { valid, errors } = validateEditUserForm(form);
    if (!valid) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setLoading(true);
    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      type: form.type,
    };
    if (form.password.trim()) {
      payload.password = form.password;
    }
    try {
      const updated = await updateUser(user.id, payload);
      onUpdated(updated);
      handleClose();
    } catch (err) {
      setError(messageFromAxiosError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Editar usuário"
      footer={
        <>
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button type="submit" form="edit-user-form" disabled={loading}>
            {loading ? "Salvando…" : "Salvar alterações"}
          </Button>
        </>
      }
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <form id="edit-user-form" className="space-y-4" onSubmit={handleSubmit}>
          <Input
            label="Nome"
            name="name"
            required
            value={form.name}
            error={fieldErrors.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
          <Input
            label="E-mail"
            type="email"
            name="email"
            required
            value={form.email}
            error={fieldErrors.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
          <Select
            label="Tipo"
            name="type"
            value={form.type}
            error={fieldErrors.type}
            onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
          >
            {USER_TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
          <Input
            label="Nova senha (opcional)"
            type="password"
            name="password"
            autoComplete="new-password"
            value={form.password}
            error={fieldErrors.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            placeholder="Deixe em branco para manter a atual"
          />
          {error ? (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          ) : null}
        </form>
      </motion.div>
    </Modal>
  );
}
