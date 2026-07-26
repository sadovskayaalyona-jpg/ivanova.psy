import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/LogoutButton";
import styles from "./dashboard.module.css";

export default async function DashboardLayout({ children }) {
  const supabase = await createClient();

  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    redirect("/login");
  }

  if (!user) {
    redirect("/login");
  }

  return (
    <section className="section">
      <div className="container">
        <div className={styles.topBar}>
          <nav className={styles.nav}>
            <Link href="/dashboard">Кабинет</Link>
            <Link href="/dashboard/aptechka">Аптечка</Link>
          </nav>
          <LogoutButton />
        </div>
        {children}
      </div>
    </section>
  );
}
