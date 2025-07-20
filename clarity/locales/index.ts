import { en } from './en';
import { es } from './es';
import { ar } from './ar';
import { bn } from './bn';
import { de } from './de';
import { fr } from './fr';
import { hi } from './hi';
import { ja } from './ja';
import { pt } from './pt';
import { ru } from './ru';
import { zh } from './zh';


export type Locale = 'en' | 'es' | 'ar' | 'bn' | 'de' | 'fr' | 'hi' | 'ja' | 'pt' | 'ru' | 'zh';
export type Direction = 'ltr' | 'rtl';

interface LocaleData {
    name: string;
    translations: typeof en;
    direction?: Direction;
}

export const locales: Record<Locale, LocaleData> = {
  en: { name: 'English', translations: en, direction: 'ltr' },
  es: { name: 'Español', translations: es, direction: 'ltr' },
  ar: { name: 'العربية', translations: ar, direction: 'rtl' },
  bn: { name: 'বাংলা', translations: bn, direction: 'ltr' },
  zh: { name: '中文 (简体)', translations: zh, direction: 'ltr' },
  fr: { name: 'Français', translations: fr, direction: 'ltr' },
  de: { name: 'Deutsch', translations: de, direction: 'ltr' },
  hi: { name: 'हिन्दी', translations: hi, direction: 'ltr' },
  ja: { name: '日本語', translations: ja, direction: 'ltr' },
  pt: { name: 'Português', translations: pt, direction: 'ltr' },
  ru: { name: 'Русский', translations: ru, direction: 'ltr' },
};
