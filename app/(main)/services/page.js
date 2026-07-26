import Link from "next/link";
import styles from "./services.module.css";

const services = [
  {
    title: "Индивидуальная консультация",
    format: "50 минут · очно или онлайн",
    text: "Для тех, кто хочет разобраться с тревогой, стрессом, отношениями или сложным периодом жизни.",
  },
  {
    title: "Консультация для пар",
    format: "80 минут · очно или онлайн",
    text: "Помощь в выстраивании диалога и решении конфликтов в паре.",
  },
  {
    title: "Экспресс-сессия",
    format: "30 минут · онлайн",
    text: "Короткая встреча для разбора конкретного острого вопроса.",
  },
  {
    title: "Пакет консультаций",
    format: "4 встречи · очно или онлайн",
    text: "Для системной работы над запросом на протяжении нескольких недель.",
  },
];

export const metadata = {
  title: "Услуги",
};

export default function ServicesPage() {
  return (
    <section className="section">
      <div className="container">
        <h1 className={styles.title}>Услуги</h1>
        <p className={styles.intro}>
          Формат и длительность встречи всегда можно обсудить индивидуально.
          Точную стоимость уточняйте при записи.
        </p>

        <div className={styles.grid}>
          {services.map((service) => (
            <div key={service.title} className={styles.card}>
              <h2 className={styles.cardTitle}>{service.title}</h2>
              <p className={styles.cardFormat}>{service.format}</p>
              <p className={styles.cardText}>{service.text}</p>
              <p className={styles.cardPrice}>
                <span className="placeholder">[цена] ₽</span>
              </p>
            </div>
          ))}
        </div>

        <div className={styles.ctaRow}>
          <Link href="/contact" className="button button--primary">
            Записаться на консультацию
          </Link>
        </div>
      </div>
    </section>
  );
}
