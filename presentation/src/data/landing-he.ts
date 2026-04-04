export const NAV_LINKS = [
  { label: 'בעיה', href: '#problem' },
  { label: 'תכונות', href: '#features' },
  { label: 'התחלה מהירה', href: '#quickstart' },
];

export const QUICKSTART_TERMINAL_LINES = [
  { text: '$ npx lightspec init', type: 'command' },
  { text: '', type: 'blank' },
  { text: 'סורק פרויקט... הושלם (0.8 שניות)', type: 'info' },
  { text: 'זוהה: TypeScript + React + Express', type: 'result' },
  { text: 'מורכבות: 42/100 → עומק סטנדרטי', type: 'result' },
  { text: '', type: 'blank' },
  { text: 'מייצר ספק... הושלם (38 שניות)', type: 'info' },
  { text: '', type: 'blank' },
  { text: 'נוצרו:', type: 'success' },
  { text: '  .lsp/spec.md     (847 שורות)', type: 'success' },
  { text: '  .lsp/tasks.md    (12 משימות)', type: 'success' },
  { text: '  .lsp/.meta.json', type: 'success' },
  { text: '', type: 'blank' },
  { text: 'הבא: lsp status | lsp graduate', type: 'highlight' },
];

export const QUICKSTART_STEPS = [
  { n: '1', icon: 'Search', label: 'סריקה', desc: 'lsp מזהה את הסטק הטכנולוגי, הארכיטקטורה והמורכבות שלך אוטומטית' },
  { n: '2', icon: 'Zap', label: 'ייצור', desc: 'ה-LLM מייצר בדיוק את הכמות הנכונה של ספק לפרויקט שלך' },
  { n: '3', icon: 'Rocket', label: 'שילוח', desc: 'השתמש ב-lsp status למעקב, lsp graduate כשמוכנים לשדרג' },
];

export const COMPARISON_FEATURES = [
  { feature: 'זמן ייצור', lss: '< 60 שניות', autospec: '30+ דקות' },
  { feature: 'קבצי ספק', lss: '1–3', autospec: '10' },
  { feature: 'עומק אדפטיבי', lss: true, autospec: false },
  { feature: 'סורק שדה חום', lss: true, autospec: false },
  { feature: 'מסלול בגרות', lss: true, autospec: '(יעד)' },
  { feature: 'ספקים לפי תפקידים', lss: false, autospec: true },
  { feature: 'טקס מלא', lss: false, autospec: true },
  { feature: 'מתאים ל-', lss: 'רוב הפרויקטים', autospec: 'מערכות מורכבות' },
];

export const LINE_COLORS: Record<string, string> = {
  command: 'text-white font-bold',
  blank: '',
  info: 'text-white/60',
  result: 'text-cyan-300/80',
  highlight: 'text-amber-300 font-semibold',
  success: 'text-green-400',
};
