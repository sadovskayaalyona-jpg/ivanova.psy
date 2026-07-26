import LoginForm from "./LoginForm";

export const metadata = {
  title: "Вход",
};

export default function LoginPage() {
  return (
    <section className="section">
      <div className="container">
        <h1>Вход в личный кабинет</h1>
        <LoginForm />
      </div>
    </section>
  );
}
