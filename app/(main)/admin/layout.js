import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import styles from "./admin.module.css";

export const metadata = {
  title: "Админ",
};

export default async function AdminLayout({ children }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // app_metadata (в отличие от user_metadata) нельзя изменить со стороны
  // клиента — только через service_role, так что этот флаг нельзя себе
  // выставить самостоятельно через обычный аккаунт.
  if (!user || user.app_metadata?.role !== "admin") {
    redirect("/login");
  }

  return (
    <div className={styles.wrap}>
      <nav className={styles.nav}>
        <span className={styles.brand}>Админ</span>
        <Link href="/admin">Результаты</Link>
        <Link href="/dashboard">В кабинет клиента</Link>
      </nav>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
