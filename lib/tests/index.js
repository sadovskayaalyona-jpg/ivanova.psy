import { gad7 } from "./gad7";
import { phq9 } from "./phq9";

export const tests = {
  [gad7.slug]: gad7,
  [phq9.slug]: phq9,
};

export const testList = Object.values(tests);

export function getTest(slug) {
  return tests[slug] ?? null;
}
