"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function login(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    return { error: "Заполните email и пароль." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    const isUnconfirmed =
      error.code === "email_not_confirmed" ||
      /email not confirmed/i.test(error.message);

    return {
      error: isUnconfirmed
        ? "Email ещё не подтверждён. Проверьте почту (и папку «Спам») и перейдите по ссылке из письма от Supabase, затем войдите снова."
        : "Неверный email или пароль.",
    };
  }

  redirect("/dashboard");
}
