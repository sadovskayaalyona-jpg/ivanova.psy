import BreathingTimer from "./BreathingTimer";

export const metadata = {
  title: "Дыхательная техника",
};

export default function BreathingPage() {
  return (
    <div>
      <h1>Квадратное дыхание</h1>
      <p>
        Помогает быстро снизить физиологическое напряжение. Дышите в ритме
        4 секунды вдох — 4 секунды задержка — 4 секунды выдох — 4 секунды
        задержка. Следите за кругом и подписью фазы.
      </p>
      <BreathingTimer />
    </div>
  );
}
