import RegisterForm from "./RegisterForm";

export const metadata = {
  title: "Регистрация",
};

export default function RegisterPage() {
  return (
    <section className="section">
      <div className="container">
        <h1>Регистрация в личном кабинете</h1>
        <p>Доступ к психологической аптечке: тесты и упражнения.</p>
        <RegisterForm />
      </div>
    </section>
  );
}
