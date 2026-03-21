import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogIn } from "lucide-react";
import { Button, Card, Input } from "../components/ui";
import { useAuth } from "../contexts/AuthContext";
import { messageFromAxiosError } from "../utils/apiMessages";

const LOGO_URL =
  "https://www.spsgroup.com.br/wp-content/uploads/2024/03/SPSConstultoria_007.png";

export default function SignIn() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/users";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login({ email: email.trim(), password });
      navigate(from, { replace: true });
    } catch (err) {
      setError(messageFromAxiosError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <Card className="border border-white/40 shadow-2xl">
          <div className="mb-6 flex justify-center">
            <div className="flex h-[103px] w-[185px] items-center justify-center rounded-xl bg-sps-primary p-2 shadow-inner">
              <img
                src={LOGO_URL}
                alt="SPS Consultoria"
                width={185}
                height={103}
                className="h-full w-full object-contain"
              />
            </div>
          </div>
          <h1 className="mb-1 text-center text-xl font-bold leading-tight text-sps-primary sm:text-2xl">
            Sistema de Gerenciamento de Usuários
          </h1>
          <p className="mb-8 text-center text-sm text-sps-secondary">
            Entre com suas credenciais para continuar
          </p>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
            noValidate
            aria-label="Formulário de login"
          >
            <Input
              label="E-mail"
              type="email"
              name="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label="Senha"
              type="password"
              name="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error ? (
              <p className="text-sm text-red-600" role="alert">
                {error}
              </p>
            ) : null}
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Entrando…" : "Entrar"}
              <LogIn className="h-5 w-5" aria-hidden />
            </Button>
          </form>
        </Card>
      </motion.div>
    </main>
  );
}
