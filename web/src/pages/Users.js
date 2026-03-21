import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Plus, RefreshCw, Trash2 } from "lucide-react";
import { AppLayout } from "../components/layout/AppLayout";
import { CreateUserModal } from "../components/users/CreateUserModal";
import { DeleteUserModal } from "../components/users/DeleteUserModal";
import { EditUserModal } from "../components/users/EditUserModal";
import { Button, Card } from "../components/ui";
import { useAuth } from "../contexts/AuthContext";
import { fetchUsers } from "../services/userApi";
import { messageFromAxiosError } from "../utils/apiMessages";
import { getUserTypeLabel } from "../utils/userDisplay";

export default function Users() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState("");

  const [createOpen, setCreateOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);

  const load = useCallback(async () => {
    setListError("");
    setLoading(true);
    try {
      const users = await fetchUsers();
      const sorted = [...users].sort((a, b) =>
        (a.email || "").localeCompare(b.email || "", "pt-BR"),
      );
      setList(sorted);
    } catch (err) {
      setListError(messageFromAxiosError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleLogout = useCallback(() => {
    logout();
    navigate("/login", { replace: true });
  }, [logout, navigate]);

  const onUserCreated = useCallback((created) => {
    setList((prev) =>
      [...prev, created].sort((a, b) =>
        (a.email || "").localeCompare(b.email || "", "pt-BR"),
      ),
    );
  }, []);

  const onUserUpdated = useCallback((updated) => {
    setList((prev) => {
      const next = prev.map((u) => (u.id === updated.id ? updated : u));
      return next.sort((a, b) =>
        (a.email || "").localeCompare(b.email || "", "pt-BR"),
      );
    });
  }, []);

  const onUserDeleted = useCallback((id) => {
    setList((prev) => prev.filter((u) => u.id !== id));
  }, []);

  const headingId = "users-page-title";

  const tableContent = useMemo(() => {
    if (loading) {
      return (
        <p className="py-12 text-center text-sps-secondary" role="status">
          Carregando usuários…
        </p>
      );
    }
    if (listError) {
      return (
        <div className="py-8 text-center">
          <p className="text-red-600" role="alert">
            {listError}
          </p>
          <Button
            type="button"
            variant="secondary"
            className="mt-4"
            onClick={load}
          >
            <RefreshCw className="h-4 w-4" aria-hidden />
            Tentar novamente
          </Button>
        </div>
      );
    }
    if (list.length === 0) {
      return (
        <p className="py-12 text-center text-sps-secondary">
          Nenhum usuário encontrado.
        </p>
      );
    }
    return null;
  }, [loading, listError, list.length, load]);

  return (
    <AppLayout user={user} onLogout={handleLogout}>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1
            id={headingId}
            className="text-2xl font-bold text-sps-primary sm:text-3xl"
          >
            Usuários
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Gerencie contas e permissões do sistema.
          </p>
        </div>
        <Button
          type="button"
          variant="icon"
          className="hidden h-11 w-auto shrink-0 px-4 md:inline-flex"
          onClick={() => setCreateOpen(true)}
        >
          <Plus className="h-5 w-5 shrink-0" aria-hidden />
          Novo usuário
        </Button>
      </div>

      <Card className="overflow-hidden p-0">
        {tableContent}
        {!loading && !listError && list.length > 0 ? (
          <>
            <div className="hidden md:block">
              <div className="overflow-x-auto">
                <table
                  className="w-full min-w-[640px] text-left text-sm"
                  aria-labelledby={headingId}
                >
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-sps-secondary">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        Nome
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        E-mail
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        Tipo
                      </th>
                      <th scope="col" className="px-4 py-3 text-right font-semibold">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {list.map((u) => (
                      <tr key={u.id} className="bg-white hover:bg-slate-50/80">
                        <td className="px-4 py-3 font-medium text-slate-900">
                          {u.name}
                        </td>
                        <td className="px-4 py-3 text-slate-700">{u.email}</td>
                        <td className="px-4 py-3 text-slate-700">
                          {getUserTypeLabel(u.type)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <Button
                              type="button"
                              variant="icon"
                              aria-label={`Editar ${u.name}`}
                              onClick={() => setEditUser(u)}
                            >
                              <Pencil className="h-5 w-5" aria-hidden />
                            </Button>
                            <Button
                              type="button"
                              variant="icon"
                              aria-label={`Excluir ${u.name}`}
                              onClick={() => setDeleteUser(u)}
                            >
                              <Trash2 className="h-5 w-5" aria-hidden />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <ul className="divide-y divide-slate-100 md:hidden">
              {list.map((u) => (
                <li key={u.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900">{u.name}</p>
                      <p className="truncate text-sm text-slate-600">{u.email}</p>
                      <p className="mt-1 text-xs text-sps-secondary">
                        {getUserTypeLabel(u.type)}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <Button
                        type="button"
                        variant="icon"
                        aria-label={`Editar ${u.name}`}
                        onClick={() => setEditUser(u)}
                      >
                        <Pencil className="h-5 w-5" aria-hidden />
                      </Button>
                      <Button
                        type="button"
                        variant="icon"
                        onClick={() => setDeleteUser(u)}
                        aria-label={`Excluir ${u.name}`}
                      >
                        <Trash2 className="h-5 w-5" aria-hidden />
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </Card>

      <Button
        type="button"
        variant="icon"
        className="fixed bottom-6 right-6 z-30 h-14 w-14 shadow-lg md:hidden"
        aria-label="Novo usuário"
        onClick={() => setCreateOpen(true)}
      >
        <Plus className="h-7 w-7" aria-hidden />
      </Button>

      <CreateUserModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={onUserCreated}
      />
      <EditUserModal
        isOpen={Boolean(editUser)}
        user={editUser}
        onClose={() => setEditUser(null)}
        onUpdated={onUserUpdated}
      />
      <DeleteUserModal
        isOpen={Boolean(deleteUser)}
        user={deleteUser}
        onClose={() => setDeleteUser(null)}
        onDeleted={onUserDeleted}
      />
    </AppLayout>
  );
}
