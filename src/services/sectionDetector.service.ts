/**
 * Serviço de Detecção e Categorização Automática de Seções
 *
 * Este serviço analisa elementos HTML e determina automaticamente
 * a categoria da seção (Hero, Features, CTA, Footer, etc.) baseado em:
 * - TagName (HEADER, FOOTER, SECTION, NAV)
 * - Classes CSS (.hero, .features, .cta, .testimonials)
 * - IDs (#header, #about, #contact)
 * - Posição na página (primeiro section = hero, último = footer)
 * - Conteúdo e estrutura interna
 */

export type SectionCategory =
    | 'header'
    | 'hero'
    | 'features'
    | 'about'
    | 'services'
    | 'testimonials'
    | 'pricing'
    | 'cta'
    | 'contact'
    | 'footer'
    | 'other';

export interface SectionInfo {
    category: SectionCategory;
    name: string;
    id: string;
    confidence: number; // 0-100 (quão certo está da categoria)
}

export class SectionDetectorService {

    /**
     * Detecta categoria da seção baseado em múltiplos sinais
     */
    static detectSection(element: HTMLElement): SectionInfo {
        const tagName = element.tagName.toLowerCase();
        const className = (element.className || '').toLowerCase();
        const id = (element.id || '').toLowerCase();
        const textContent = (element.textContent || '').toLowerCase();

        // Score system para cada categoria
        const scores: Record<SectionCategory, number> = {
            header: 0,
            hero: 0,
            features: 0,
            about: 0,
            services: 0,
            testimonials: 0,
            pricing: 0,
            cta: 0,
            contact: 0,
            footer: 0,
            other: 0
        };

        // 🎯 HEADER
        if (tagName === 'header') scores.header += 50;
        if (id.includes('header') || id.includes('nav')) scores.header += 30;
        if (className.includes('header') || className.includes('navbar')) scores.header += 30;
        if (this.isFirstElement(element)) scores.header += 20;

        // 🎯 HERO
        if (className.includes('hero') || id.includes('hero')) scores.hero += 50;
        if (className.includes('banner') || className.includes('jumbotron')) scores.hero += 40;
        if (this.isFirstSection(element)) scores.hero += 30;
        if (element.querySelector('h1')) scores.hero += 20;

        // 🎯 FEATURES
        if (className.includes('feature') || id.includes('feature')) scores.features += 50;
        if (className.includes('benefit') || className.includes('advantage')) scores.features += 40;
        if (this.hasMultipleCards(element)) scores.features += 30;

        // 🎯 ABOUT
        if (className.includes('about') || id.includes('about')) scores.about += 50;
        if (className.includes('who-we-are') || className.includes('nossa-historia')) scores.about += 40;
        if (textContent.includes('sobre') || textContent.includes('about')) scores.about += 20;

        // 🎯 SERVICES
        if (className.includes('service') || id.includes('service')) scores.services += 50;
        if (className.includes('soluc') || className.includes('solution')) scores.services += 40;

        // 🎯 TESTIMONIALS
        if (className.includes('testimonial') || id.includes('testimonial')) scores.testimonials += 50;
        if (className.includes('depoimento') || className.includes('review')) scores.testimonials += 40;
        if (element.querySelectorAll('[class*="star"]').length > 0) scores.testimonials += 30;

        // 🎯 PRICING
        if (className.includes('pric') || id.includes('pric')) scores.pricing += 50;
        if (className.includes('plano') || className.includes('plan')) scores.pricing += 40;
        if (textContent.includes('r$') || textContent.includes('$')) scores.pricing += 20;

        // 🎯 CTA
        if (className.includes('cta') || id.includes('cta')) scores.cta += 50;
        if (className.includes('call-to-action')) scores.cta += 50;
        if (element.querySelectorAll('button').length > 0) scores.cta += 20;

        // 🎯 CONTACT
        if (className.includes('contact') || id.includes('contact')) scores.contact += 50;
        if (className.includes('contato') || className.includes('form')) scores.contact += 40;
        if (element.querySelector('form')) scores.contact += 30;

        // 🎯 FOOTER
        if (tagName === 'footer') scores.footer += 50;
        if (id.includes('footer') || className.includes('footer')) scores.footer += 30;
        if (this.isLastElement(element)) scores.footer += 20;

        // Encontrar categoria com maior score
        const category = this.getHighestScore(scores);
        const confidence = scores[category];

        return {
            category,
            name: this.generateSectionName(category),
            id: this.ensureUniqueId(element, category),
            confidence
        };
    }

    private static getHighestScore(scores: Record<SectionCategory, number>): SectionCategory {
        let maxScore = 0;
        let maxCategory: SectionCategory = 'other';

        for (const [category, score] of Object.entries(scores)) {
            if (score > maxScore) {
                maxScore = score;
                maxCategory = category as SectionCategory;
            }
        }

        return maxCategory;
    }

    private static generateSectionName(category: SectionCategory): string {
        const names: Record<SectionCategory, string> = {
            header: 'Cabeçalho',
            hero: 'Hero Principal',
            features: 'Recursos',
            about: 'Sobre Nós',
            services: 'Serviços',
            testimonials: 'Depoimentos',
            pricing: 'Preços',
            cta: 'Chamada para Ação',
            contact: 'Contato',
            footer: 'Rodapé',
            other: 'Seção'
        };

        return names[category];
    }

    private static ensureUniqueId(element: HTMLElement, category: SectionCategory): string {
        // Se já tem ID, usar ele
        if (element.id) {
            return element.id;
        }

        // Gerar ID baseado na categoria
        const baseId: string = category;
        let counter = 1;
        let finalId: string = baseId;

        // Garantir unicidade
        while (document.getElementById(finalId)) {
            finalId = `${baseId}-${counter}`;
            counter++;
        }

        // Aplicar ID ao elemento
        element.id = finalId;

        return finalId;
    }

    private static isFirstElement(element: HTMLElement): boolean {
        const body = document.body;
        const firstElement = body.querySelector('header, section, div');
        return element === firstElement;
    }

    private static isFirstSection(element: HTMLElement): boolean {
        if (element.tagName.toLowerCase() !== 'section') return false;
        const allSections = document.querySelectorAll('section');
        return allSections[0] === element;
    }

    private static isLastElement(element: HTMLElement): boolean {
        const body = document.body;
        const children = Array.from(body.children);
        return children[children.length - 1] === element ||
            children[children.length - 2] === element;
    }

    private static hasMultipleCards(element: HTMLElement): boolean {
        const cards = element.querySelectorAll('[class*="card"], [class*="box"], [class*="item"]');
        return cards.length >= 3;
    }

    /**
     * Busca todas as seções da página
     */
    static getAllSections(): SectionInfo[] {
        const sections: SectionInfo[] = [];
        const candidates = document.querySelectorAll('header, footer, section, nav, aside, main, article');

        candidates.forEach((element) => {
            const sectionInfo = this.detectSection(element as HTMLElement);

            // Apenas incluir se tiver confiança mínima
            if (sectionInfo.confidence >= 20) {
                sections.push(sectionInfo);
            }
        });

        return sections;
    }
}
