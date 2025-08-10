import type { FormType } from "../api";


export function getTypeUrlMapping(type: FormType) {
  switch (type) {
    case 'habit':
      return `/daily-habit-builder`;
    case 'pain':
      return `/pain-scale`;
    case 'sleep':
      return `/sleep-scale`;
    case 'stress':
      return `/stress-scale`;
  }
}