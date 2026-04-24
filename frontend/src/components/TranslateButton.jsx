import React, { useRef } from 'react';
import Lottie from 'lottie-react';
import TranslateAnimation from '../assets/Translate.json';
import { useLanguage } from '../contexts/LanguageContext';

export default function TranslateButton() {
    const lottieRef = useRef(null);
    const { language, toggleLanguage } = useLanguage();

    const handleClick = () => {
        // Dispara a animação Lottie do ínicio
        lottieRef.current.goToAndPlay(0, true);
        
        // Troca o idioma do sistema
        toggleLanguage();
    };

    return (
        <button 
            onClick={handleClick}
            className="relative flex-shrink-0 flex items-center justify-center p-2 rounded-full hover:bg-white/10 transition-colors w-10 h-10 md:w-12 md:h-12 cursor-pointer group"
            title={language === 'pt' ? "Change to English" : "Mudar para Português"}
        >
            <div className="w-full h-full invert opacity-80">
                <Lottie
                    lottieRef={lottieRef}
                    animationData={TranslateAnimation}
                    autoplay={false}
                    loop={false}
                    style={{ width: '100%', height: '100%' }}
                />
            </div>
            {/* Tooltip Badge */}
            <span className="absolute -bottom-8 bg-brand-900 border border-brand-700 text-xs text-brand-300 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {language === 'pt' ? 'EN-US' : 'PT-BR'}
            </span>
        </button>
    );
}
