import { neurotype } from "@/lib/tests/neurotype";
import NeurotypeForm from "./NeurotypeForm";
import styles from "./neurotype.module.css";

export const metadata = {
  title: neurotype.title,
};

export default function NeurotypePage() {
  return (
    <div>
      <h1>{neurotype.title}</h1>
      <p className={styles.description}>{neurotype.description}</p>
      <p className={styles.inspiredBy}>{neurotype.inspiredBy}</p>
      <NeurotypeForm />
      <p className={styles.disclaimer}>{neurotype.disclaimer}</p>
    </div>
  );
}
