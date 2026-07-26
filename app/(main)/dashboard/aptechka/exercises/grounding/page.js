import GroundingGuide from "./GroundingGuide";

export const metadata = {
  title: "Техника заземления",
};

export default function GroundingPage() {
  return (
    <div>
      <h1>Техника заземления «5-4-3-2-1»</h1>
      <p>
        Помогает вернуться в настоящий момент, когда тревога захлёстывает.
        Проходите шаги по очереди, не торопясь.
      </p>
      <GroundingGuide />
    </div>
  );
}
