import { wheelOfBalance } from "@/lib/tests/wheel-of-balance";
import WheelForm from "./WheelForm";
import styles from "./wheel.module.css";

export const metadata = {
  title: wheelOfBalance.title,
};

export default function WheelPage() {
  return (
    <div>
      <h1>{wheelOfBalance.title}</h1>
      <p className={styles.description}>{wheelOfBalance.description}</p>
      <WheelForm />
      <p className={styles.disclaimer}>{wheelOfBalance.disclaimer}</p>
    </div>
  );
}
