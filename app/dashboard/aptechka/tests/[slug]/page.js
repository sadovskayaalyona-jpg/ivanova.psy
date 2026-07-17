import { notFound } from "next/navigation";
import { getTest } from "@/lib/tests";
import TestForm from "./TestForm";
import styles from "./test.module.css";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const test = getTest(slug);
  return { title: test ? test.title : "Тест" };
}

export default async function TestPage({ params }) {
  const { slug } = await params;
  const test = getTest(slug);

  if (!test) {
    notFound();
  }

  return (
    <div>
      <h1>{test.title}</h1>
      <p className={styles.description}>{test.description}</p>
      <TestForm test={test} />
      <p className={styles.copyright}>{test.copyright}</p>
    </div>
  );
}
