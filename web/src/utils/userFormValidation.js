const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateCreateUserForm({ name, email, type, password }) {
  const errors = {};
  if (!name?.trim()) {
    errors.name = "Nome é obrigatório.";
  }
  if (!email?.trim()) {
    errors.email = "E-mail é obrigatório.";
  } else if (!EMAIL_RE.test(email.trim())) {
    errors.email = "Informe um e-mail válido.";
  }
  if (!type?.trim()) {
    errors.type = "Tipo é obrigatório.";
  }
  if (!password?.trim()) {
    errors.password = "Senha é obrigatória.";
  }
  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateEditUserForm({ name, email, type, password }) {
  const errors = {};
  if (!name?.trim()) {
    errors.name = "Nome é obrigatório.";
  }
  if (!email?.trim()) {
    errors.email = "E-mail é obrigatório.";
  } else if (!EMAIL_RE.test(email.trim())) {
    errors.email = "Informe um e-mail válido.";
  }
  if (!type?.trim()) {
    errors.type = "Tipo é obrigatório.";
  }
  const pwd = password?.trim();
  if (pwd && pwd.length < 4) {
    errors.password = "A senha deve ter pelo menos 4 caracteres.";
  }
  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
