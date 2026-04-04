import { useState, useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';

const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";

export default function TypewriterText({ text, elementType: Component = 'span', className = '', speed = 25, delay = 0, once = true }) {
    const [displayText, setDisplayText] = useState('');
    const ref = useRef(null);
    const isInView = useInView(ref, { once });

    useEffect(() => {
        // Escuta se o componente apareceu na tela e anima
        if (!isInView) return;

        // Resetando a string a cada troca de linguagem ou re-render inicial
        let isMounted = true;
        setDisplayText('');
        
        const chars = Array.from(text);
        let charIndex = 0;

        const timeout = setTimeout(() => {
            const interval = setInterval(() => {
                if (!isMounted) return;
                
                setDisplayText(() => {
                    const completedText = chars.slice(0, charIndex).join('');
                    
                    if (charIndex >= chars.length) {
                        clearInterval(interval);
                        return text;
                    }
                    
                    // Mostra uma string hacker temporária para a letra atual
                    const randomChar = CHARSET[Math.floor(Math.random() * CHARSET.length)];
                    return completedText + randomChar;
                });
                
                charIndex += 1;
            }, speed);

            return () => clearInterval(interval);
        }, delay);
        
        return () => {
            isMounted = false;
            clearTimeout(timeout);
        };
    }, [text, speed, delay, isInView]);

    return (
        <Component ref={ref} className={className}>
            {/* O \u00A0 evita que a div perca a altura se estiver completamente vazia */}
            {displayText || "\u00A0"}
        </Component>
    );
}
