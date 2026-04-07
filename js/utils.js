export function greet(name) {
  return `Привет, ${name}!`;
}

export function add(a, b) {
  return a + b;
}

export function multiply(a, b) {
  return a * b;
}

export const PI = 3.14159;

export default function defaultGreeting() {
  return "Это экспорт по умолчанию";
}