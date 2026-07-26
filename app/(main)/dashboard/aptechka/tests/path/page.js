import PathWizard from "./PathWizard";
import styles from "./path.module.css";

export const metadata = {
  title: "Путь к балансу",
};

export default function PathPage() {
  return (
    <div>
      <h1>Путь к балансу</h1>
      <p className={styles.intro}>
        Колесо баланса, ваши цели и профиль ведущего нейромедиатора — в одной
        персональной карте с рекомендациями.
      </p>
      <PathWizard />
    </div>
  );
}
