import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth, isFirebaseConfigured } from "../lib/firebase";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";

export default function AdminApp() {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    if (!auth) {
      setUser(null);
      return;
    }
    return onAuthStateChanged(auth, (u) => {
      // Anonymous sessions (visitors) never count as an employee session here.
      setUser(u && !u.isAnonymous ? u : null);
    });
  }, []);

  if (!isFirebaseConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy-950 px-6 text-center text-sm text-blue-200">
        O chat ainda não foi configurado. Adicione as variáveis de ambiente do Firebase e reimplante o site.
      </div>
    );
  }

  if (user === undefined) {
    return <div className="flex min-h-screen items-center justify-center bg-navy-950 text-sm text-blue-200">Carregando…</div>;
  }

  return user ? <AdminDashboard user={user} /> : <AdminLogin />;
}
