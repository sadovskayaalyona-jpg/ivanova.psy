import { siteConfig } from "@/lib/site-config";
import styles from "./about.module.css";

export const metadata = {
  title: "Обо мне",
};

export default function AboutPage() {
  return (
    <section className="section">
      <div className={`container ${styles.layout}`}>
        <div className={styles.photo} aria-hidden="true">
          Ваше фото
        </div>

        <div className={styles.content}>
          <h1 className={styles.title}>Обо мне</h1>

          <p className={`${styles.text} placeholder`}>
            Здесь будет ваш рассказ о себе: путь в профессию, чем вы
            руководствуетесь в работе, что для вас важно в контакте с
            клиентом.
          </p>

          <h2 className={styles.subtitle}>Образование и квалификация</h2>
          <ul className={styles.list}>
            <li className="placeholder">
              Университет, факультет, год окончания
            </li>
            <li className="placeholder">
              Дополнительное образование, курсы повышения квалификации
            </li>
            <li className="placeholder">
              Членство в профессиональных ассоциациях (если есть)
            </li>
          </ul>

          <h2 className={styles.subtitle}>Подход в работе</h2>
          <p className={`${styles.text} placeholder`}>
            Здесь опишите направления, в которых вы работаете — например,
            когнитивно-поведенческая терапия, гештальт-подход или
            экзистенциальная терапия — и как это помогает клиентам.
          </p>

          <p className={styles.footnote}>
            Принимаю {siteConfig.city.toLowerCase()}.
          </p>
        </div>
      </div>
    </section>
  );
}
