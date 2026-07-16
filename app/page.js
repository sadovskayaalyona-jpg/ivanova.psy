import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import styles from "./page.module.css";

const steps = [
  {
    title: "Заявка",
    text: "Оставляете заявку любым удобным способом — по телефону, почте или в Telegram.",
  },
  {
    title: "Знакомство",
    text: "На первой встрече обсуждаем ваш запрос и решаем, подходит ли формат работы именно вам.",
  },
  {
    title: "Регулярные встречи",
    text: "Дальше — сессии в комфортном для вас темпе, очно или онлайн.",
  },
];

export default function Home() {
  return (
    <>
      <section className={`section ${styles.hero}`}>
        <div className="container">
          <h1 className={styles.heroName}>{siteConfig.psychologistName}</h1>
          <p className={styles.heroTagline}>{siteConfig.tagline}</p>
          <p className={styles.heroText}>
            Помогаю разобраться с тревогой, стрессом и сложными периодами
            жизни — в комфортном темпе и без осуждения. Работаю очно и
            онлайн.
          </p>
          <div className={styles.heroActions}>
            <Link href="/contact" className="button button--primary">
              Записаться на консультацию
            </Link>
            <Link href="/services" className="button button--outline">
              Смотреть услуги
            </Link>
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <h2 className={styles.sectionTitle}>Как проходит работа</h2>
          <div className={styles.steps}>
            {steps.map((step, index) => (
              <div key={step.title} className={styles.step}>
                <span className={styles.stepNumber}>{index + 1}</span>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepText}>{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className={styles.teaser}>
            <span className={styles.teaserBadge}>В разработке</span>
            <h2 className={styles.sectionTitle}>Психологическая аптечка</h2>
            <p className={styles.teaserText}>
              Скоро здесь появится небольшой ИИ-помощник для быстрой
              поддержки при тревоге между сессиями — короткие упражнения и
              техники самопомощи. Раздел ещё в разработке.
            </p>
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className={`container ${styles.ctaBand}`}>
          <h2 className={styles.sectionTitle}>Готовы сделать первый шаг?</h2>
          <Link href="/contact" className="button button--primary">
            Связаться со мной
          </Link>
        </div>
      </section>
    </>
  );
}
