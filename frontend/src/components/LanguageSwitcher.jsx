import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'es' : 'en';
        i18n.changeLanguage(newLang);
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary"
        >
            <Globe className="h-4 w-4" />
            <span className="uppercase font-semibold">{i18n.language === 'en' ? 'ES' : 'EN'}</span>
        </Button>
    );
}
