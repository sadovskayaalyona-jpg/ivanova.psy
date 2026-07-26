"use client";

import { useActionState } from "react";
import Link from "next/link";
import { register } from "./actions";
import styles from "./register.module.css";

const initialState = { error: null, success: false };

export default function RegisterForm() {
  const [state, formAction, pending] = useActionState(register, initialState);

  if (state.success) {
    return (
      <div className={styles.formWrap}>
        <p className={styles.success}>{state.message}</p>
        <Link className="button button--primary" href="/login">
          Перейти ко входу
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.formWrap}>
      <form action={formAction} className={styles.form}>
        <label className={styles.field}>
          <span>Имя</span>
          <input type="text" name="fullName" autoComplete="name" />
        </label>
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
            minLength={6}
            autoComplete="new-password"
          />
        </label>
        {state.error && <p className={styles.error}>{state.error}</p>}
        <button
          className="button button--primary"
          type="submit"
          disabled={pending}
        >
          {pending ? "Регистрируем…" : "Зарегистрироваться"}
        </button>
      </form>
      <p className={styles.switch}>
        Уже есть аккаунт? <Link href="/login">Войти</Link>
      </p>
    </div>
  );
}
