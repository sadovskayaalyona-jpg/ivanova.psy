"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login } from "./actions";
import styles from "./login.module.css";

const initialState = { error: null };

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <div className={styles.formWrap}>
      <form action={formAction} className={styles.form}>
        <label className={styles.field}>
          <span>Email</span>
          <input type="email" name="email" required autoComplete="email" />
        </label>
        <label className={styles.field}>
          <span>Пароль</span>
          <input
            type="password"
            name="password"
            required
            autoComplete="current-password"
          />
        </label>
        {state.error && <p className={styles.error}>{state.error}</p>}
        <button
          className="button button--primary"
          type="submit"
          disabled={pending}
        >
          {pending ? "Входим…" : "Войти"}
        </button>
      </form>
      <p className={styles.switch}>
        Ещё нет аккаунта? <Link href="/register">Зарегистрироваться</Link>
      </p>
    </div>
  );
}
