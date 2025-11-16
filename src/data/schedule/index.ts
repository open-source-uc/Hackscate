export const getSchedule = (lang: 'es' | 'en' = 'en') => {
  switch (lang) {
    case 'en':
      return import('./en.json').then(m => m.default);
    case 'es':
    default:
      return import('./es.json').then(m => m.default);
  }
};