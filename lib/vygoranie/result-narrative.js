import { wheelSpheres } from "./block2-wheel";
import { bravermanScale } from "./block3-braverman";
import { archetypes } from "./block4-archetypes";

// «Что будет, если это не остановить» — держит интригу: описывает риск
// конкретно и узнаваемо, но не даёт решения (решение — на диагностике).
const stakesByArchetype = {
  "critical-parent":
    "Если этот паттерн закрепится, команда постепенно перестанет говорить вам о проблемах вслух — вы узнаете о провале в последний момент, когда исправить будет труднее и дороже.",
  "caring-parent":
    "Команда постепенно разучится справляться без вас — а вы окажетесь единственной точкой, через которую проходит всё. Полноценный отпуск станет физически невозможен.",
  "lone-expert":
    "Отдел или проект становится заложником вашего личного ресурса — при любой болезни, отпуске или уходе всё останавливается, а не продолжается без вас.",
  "hurt-child":
    "Накопленная обида редко уходит сама — она либо взрывается резким, непропорциональным решением, либо превращается в хроническую усталость и тихий цинизм.",
  "rebel-child":
    "Постоянная борьба с системой истощает вас раньше, чем меняет систему — риск резкого конфликта с руководством или демонстративного увольнения на эмоциях выше, чем кажется.",
  "compliant-child":
    "Подавленное несогласие накапливается как долг — рано или поздно он предъявляется весь и сразу, часто в самый неудачный момент.",
  "hero-firefighter":
    "Незаметно для себя вы можете начать неосознанно поддерживать хаос вокруг — потому что именно в кризисе вы чувствуете себя нужным. Штиль стал редкостью не случайно.",
  "status-hostage":
    "Любая временная неудача, реструктуризация или смена руководства ощущается не как рабочий эпизод, а как угроза себе как личности — риск тяжёлого падения самооценки при первом серьёзном сбое.",
};

export function buildResultNarrative({ wheelValues, archetypeKey, bravermanTypeKey }) {
  const archetype = archetypes.find((a) => a.key === archetypeKey);
  const type = bravermanScale.types.find((t) => t.key === bravermanTypeKey);

  const sortedSpheres = [...wheelSpheres.spheres].sort(
    (a, b) => wheelValues[a.key] - wheelValues[b.key]
  );
  const lowestSphere = sortedSpheres[0];
  const secondLowestSphere = sortedSpheres[1];

  const combined = `Сочетание «${archetype?.label}» и «${type?.label}» означает, что ${type?.burnoutPhrase}, а управленческая привычка «${archetype?.label.toLowerCase()}» не даёт вам вовремя это заметить и остановиться. Заметнее всего это в сфере «${lowestSphere?.label}» (${wheelValues[lowestSphere?.key]}/10) — именно туда сейчас утекает больше всего ресурса, за ней тянется и «${secondLowestSphere?.label}».`;

  const stakes = stakesByArchetype[archetypeKey] ?? "";

  return { archetype, type, lowestSphere, secondLowestSphere, combined, stakes };
}
