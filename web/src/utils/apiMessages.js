const MAP = {
  invalid_credentials: "E-mail ou senha incorretos.",
  validation_error: "Verifique os campos e tente novamente.",
  email_already_exists: "Este e-mail já está cadastrado.",
  user_not_found: "Usuário não encontrado.",
  missing_or_malformed_token: "Sessão inválida. Faça login novamente.",
  invalid_or_expired_token: "Sessão expirada. Faça login novamente.",
};

export function messageForErrorCode(code) {
  if (!code) return "Não foi possível concluir a operação.";
  return MAP[code] || "Ocorreu um erro inesperado. Tente novamente.";
}

export function messageFromAxiosError(err) {
  const code = err.response?.data?.error;
  if (typeof code === "string") return messageForErrorCode(code);
  if (err.message === "Network Error") {
    return "Não foi possível conectar ao servidor. Verifique sua rede.";
  }
  return "Não foi possível concluir a operação.";
}
