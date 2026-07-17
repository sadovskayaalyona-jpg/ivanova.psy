import { signOut } from "@/app/dashboard/actions";
import styles from "./LogoutButton.module.css";

export default function LogoutButton() {
  return (
    <form action={signOut}>
      <button type="submit" className={styles.button}>
        Выйти
      </button>
    </form>
  );
}
