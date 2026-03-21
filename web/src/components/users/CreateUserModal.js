import { useState } from "react";
import { Modal, Button, Input, Select } from "../ui";
import { createUser } from "../../services/userApi";
import { messageFromAxiosError } from "../../utils/apiMessages";
import { validateCreateUserForm } from "../../utils/userFormValidation";
import { USER_TYPE_OPTIONS } from "./userTypes";

const empty = {
  name: "",
  email: "",
  type: "user",
  password: "",
};

export function CreateUserModal({ isOpen, onClose, onCreated }) {
  const [form, setForm] = useState(empty);
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleClose() {
    setForm(empty);
    setFieldErrors({});
    setError("");
    onClose();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const { valid, errors } = validateCreateUserForm(form);
    if (!valid) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setLoading(true);
    try {
      const user = await createUser({
        name: form.name.trim(),
        email: form.email.trim(),
        type: form.type,
        password: form.password,
      });
      onCreated(user);
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
      title="Cadastrar usuário"
      footer={
        <>
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button type="submit" form="create-user-form" disabled={loading}>
            {loading ? "Salvando…" : "Salvar"}
          </Button>
        </>
      }
    >
      <form id="create-user-form" className="space-y-4" onSubmit={handleSubmit}>
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
          label="Senha"
          type="password"
          name="password"
          autoComplete="new-password"
          required
          value={form.password}
          error={fieldErrors.password}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
        />
        {error ? (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}
      </form>
    </Modal>
  );
}
