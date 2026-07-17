"use server";

import { createClient } from "@/lib/supabase/server";

export async function register(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");
  const fullName = formData.get("fullName");

  if (!email || !password) {
    return { error: "Заполните email и пароль." };
  }
  if (password.length < 6) {
    return { error: "Пароль должен быть не короче 6 символов." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName || null },
    },
  });

  if (error) {
    return {
      error:
        error.message === "User already registered"
          ? "Такой email уже зарегистрирован."
          : "Не получилось зарегистрироваться. Проверьте данные и попробуйте снова.",
    };
  }

  return {
    success: true,
    message:
      "Почти готово! Мы отправили письмо для подтверждения на указанный email — перейдите по ссылке в письме, а затем войдите.",
  };
}
