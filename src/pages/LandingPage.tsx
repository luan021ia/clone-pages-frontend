import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const scrollToPricing = () => {
    const pricingGrid = document.getElementById('pricing-grid');
    if (pricingGrid) {
      pricingGrid.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleGetStarted = () => {
    scrollToPricing();
  };

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-container">
          <div className="nav-brand">
            <img src="/spycopy-logo.png" alt="Clone Pages" className="nav-logo" />
            <span className="nav-title">Clone Pages</span>
          </div>
          <div className="nav-links">
            <a href="#features">Recursos</a>
            <a href="#pricing">Preços</a>
            <a href="#faq">FAQ</a>
            <button className="nav-login-btn" onClick={() => navigate('/login')}>
              Entrar
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        {/* RetroGrid Background */}
        <div className="retro-grid-container">
          <div className="retro-grid">
            <div className="retro-grid-pattern" />
          </div>
          <div className="retro-grid-overlay" />
        </div>

        {/* Radial Gradient Background */}
        <div className="hero-gradient-bg" />

        <div className="hero-container">
          <div className="hero-content">
            {/* Badge with Icon */}
            <div className="hero-badge-wrapper">
              <span className="hero-badge-animated-border" />
              <div className="hero-badge-inner">
                <span className="hero-badge-text">A ferramenta mais poderosa de clonagem</span>
                <svg className="hero-badge-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            {/* Main Title */}
            <h1 className="hero-title">
              <span className="hero-title-regular">Clone e edite </span>
              <span className="hero-title-gradient">qualquer página</span>
              <span className="hero-title-regular"> em segundos</span>
            </h1>

            {/* Description */}
            <p className="hero-description">
              Capture páginas da web, edite visualmente, injete seus códigos de rastreamento e baixe tudo pronto para usar. Sem complicação, sem código.
            </p>

            {/* CTA Button with Animated Border */}
            <div className="hero-cta-wrapper">
              <span className="hero-cta-spinning-border">
                <span className="hero-cta-spinner" />
              </span>
              <div className="hero-cta-inner">
                <button className="hero-cta-button" onClick={handleGetStarted}>
                  <span>Começar Agora</span>
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">5000+</div>
                <div className="stat-label">Páginas clonadas</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">98%</div>
                <div className="stat-label">Taxa de sucesso</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Suporte disponível</div>
              </div>
            </div>
          </div>

          {/* Hero Visual - Video Container */}
          <div className="hero-visual-container">
            <div className="hero-visual-wrapper">
              <img
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop"
                className="hero-visual-img hero-visual-light"
                alt="Dashboard preview"
              />
              <div className="hero-video-container">
                <video
                  className="hero-visual-img hero-visual-dark"
                  controls={false}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                >
                  {/* O vídeo será inserido aqui posteriormente */}
                </video>
              </div>
            </div>
            <button 
              className="hero-video-cta-btn" 
              onClick={scrollToPricing}
            >
              Ver Planos e Preços
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Tudo que você precisa em uma ferramenta</h2>
            <p className="section-subtitle">
              Clonagem inteligente, edição visual e injeção de códigos. Simples e poderoso.
            </p>
          </div>

          {/* Feature Showcase 1 - Clone Instantâneo */}
          <div className="feature-showcase">
            <div className="feature-showcase-content">
              <div className="feature-showcase-badge">
                <span>⚡ Rápido e Eficiente</span>
              </div>
              <h3 className="feature-showcase-title">Clone qualquer página em segundos</h3>
              <p className="feature-showcase-description">
                Nossa tecnologia avançada captura todo o HTML, CSS e estrutura da página original. 
                Mantenha 100% da fidelidade visual sem perder nenhum detalhe.
              </p>
              <ul className="feature-showcase-list">
                <li>
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  <span>Captura completa de HTML e CSS</span>
                </li>
                <li>
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  <span>Fidelidade visual de 100%</span>
                </li>
                <li>
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  <span>Processo em menos de 5 segundos</span>
                </li>
              </ul>
            </div>
            <div className="feature-showcase-image">
              <img 
                src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop" 
                alt="Interface de clonagem de páginas"
              />
            </div>
          </div>

          {/* Feature Showcase 2 - Editor Visual */}
          <div className="feature-showcase feature-showcase-reverse">
            <div className="feature-showcase-content">
              <div className="feature-showcase-badge">
                <span>✏️ Edição Intuitiva</span>
              </div>
              <h3 className="feature-showcase-title">Edite visualmente sem escrever código</h3>
              <p className="feature-showcase-description">
                Interface drag-and-drop poderosa que permite editar textos, substituir imagens, 
                modificar links e ajustar vídeos diretamente na página clonada.
              </p>
              <ul className="feature-showcase-list">
                <li>
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  <span>Editor WYSIWYG intuitivo</span>
                </li>
                <li>
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  <span>Suporte para imagens, vídeos e links</span>
                </li>
                <li>
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  <span>Preview em tempo real</span>
                </li>
              </ul>
            </div>
            <div className="feature-showcase-image">
              <img 
                src="https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&auto=format&fit=crop" 
                alt="Editor visual de páginas web"
              />
            </div>
          </div>

          {/* Feature Showcase 3 - Injeção de Códigos */}
          <div className="feature-showcase">
            <div className="feature-showcase-content">
              <div className="feature-showcase-badge">
                <span>🎯 Rastreamento Integrado</span>
              </div>
              <h3 className="feature-showcase-title">Adicione seus códigos de rastreamento</h3>
              <p className="feature-showcase-description">
                Injete Meta Pixel, Google Tag Manager, botão do WhatsApp, scripts UTM e Microsoft 
                Clarity com apenas um clique. Tudo pronto para rastrear suas conversões.
              </p>
              <ul className="feature-showcase-list">
                <li>
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  <span>Meta Pixel e Google Tag Manager</span>
                </li>
                <li>
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  <span>Botão WhatsApp e Scripts UTM</span>
                </li>
                <li>
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  <span>Microsoft Clarity integrado</span>
                </li>
              </ul>
            </div>
            <div className="feature-showcase-image">
              <img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop" 
                alt="Painel de injeção de códigos de rastreamento"
              />
            </div>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" stroke="url(#gradient1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <defs>
                    <linearGradient id="gradient1" x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#60a5fa"/>
                      <stop offset="1" stopColor="#06b6d4"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <h3>Clonagem Instantânea</h3>
              <p>Clone qualquer página da web em segundos, mantendo 100% do layout e design original.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="url(#gradient2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="url(#gradient2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <defs>
                    <linearGradient id="gradient2" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#f093fb"/>
                      <stop offset="1" stopColor="#f5576c"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <h3>Editor Visual</h3>
              <p>Edite textos, imagens, vídeos e links diretamente na página clonada com interface intuitiva.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="url(#gradient3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="8.5" cy="7" r="4" stroke="url(#gradient3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M20 8v6M23 11h-6" stroke="url(#gradient3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <defs>
                    <linearGradient id="gradient3" x1="1" y1="3" x2="23" y2="21" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#4facfe"/>
                      <stop offset="1" stopColor="#00f2fe"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <h3>Injeção de Códigos</h3>
              <p>Adicione Meta Pixel, Google Tag Manager, Botão WhatsApp, Scripts UTM e Microsoft Clarity com apenas um clique.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="url(#gradient4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7 10l5 5 5-5M12 15V3" stroke="url(#gradient4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <defs>
                    <linearGradient id="gradient4" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#fa709a"/>
                      <stop offset="1" stopColor="#fee140"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <h3>Download Limpo</h3>
              <p>Baixe o HTML final 100% limpo, sem rastreadores indesejados, pronto para hospedagem.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="3" width="20" height="14" rx="2" stroke="url(#gradient5)" strokeWidth="2"/>
                  <path d="M8 21h8M12 17v4" stroke="url(#gradient5)" strokeWidth="2" strokeLinecap="round"/>
                  <defs>
                    <linearGradient id="gradient5" x1="2" y1="3" x2="22" y2="21" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#a8edea"/>
                      <stop offset="1" stopColor="#fed6e3"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <h3>Visualização Responsiva</h3>
              <p>Pré-visualize em Desktop, Tablet e Mobile antes de baixar. Garanta que tudo funcione perfeitamente.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="url(#gradient6)" strokeWidth="2"/>
                  <path d="M12 6v6l4 2" stroke="url(#gradient6)" strokeWidth="2" strokeLinecap="round"/>
                  <defs>
                    <linearGradient id="gradient6" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#ffecd2"/>
                      <stop offset="1" stopColor="#fcb69f"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <h3>Histórico Inteligente</h3>
              <p>Acesso rápido às últimas URLs e códigos usados. Reutilize configurações com um clique.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Clone em 3 passos simples</h2>
            <p className="section-subtitle">
              Do início ao fim em menos de 5 minutos. Veja como é fácil clonar e personalizar qualquer página.
            </p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-image">
                <img 
                  src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=600&auto=format&fit=crop" 
                  alt="Passo 1 - Cole a URL"
                />
              </div>
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Cole a URL</h3>
                <p>Insira a URL da página que deseja clonar e clique em "Clonar". Nossa tecnologia captura tudo em segundos.</p>
              </div>
            </div>

            <div className="step-card">
              <div className="step-image">
                <img 
                  src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop" 
                  alt="Passo 2 - Edite Visualmente"
                />
              </div>
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Edite Visualmente</h3>
                <p>Ative o modo edição e modifique textos, imagens, vídeos e links com interface intuitiva. Sem código necessário.</p>
              </div>
            </div>

            <div className="step-card">
              <div className="step-image">
                <img 
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop" 
                  alt="Passo 3 - Injete e Baixe"
                />
              </div>
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Injete e Baixe</h3>
                <p>Adicione seus códigos de rastreamento e baixe o HTML final pronto para uso. Hospede onde quiser!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="pricing-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Planos que cabem no seu bolso</h2>
            <p className="section-subtitle">
              Escolha o plano ideal para suas necessidades. Sem taxas ocultas, sem surpresas.
            </p>
          </div>

          <div id="pricing-grid" className="pricing-grid">
            {/* Plano Mensal */}
            <div className="pricing-card">
              <div className="pricing-header">
                <h3>Mensal</h3>
                <p>Flexibilidade total</p>
              </div>
              <div className="pricing-price">
                <span className="price-currency">R$</span>
                <span className="price-amount">67</span>
                <span className="price-period">/mês</span>
              </div>
              <ul className="pricing-features">
                <li>
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  <span>Clonagem ilimitada de páginas</span>
                </li>
                <li>
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  <span>Editor visual completo</span>
                </li>
                <li>
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  <span>Injeção de códigos (Pixel, GTM, etc)</span>
                </li>
                <li>
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  <span>Download em HTML limpo</span>
                </li>
                <li>
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  <span>Suporte por e-mail</span>
                </li>
                <li>
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  <span>Histórico de páginas clonadas</span>
                </li>
              </ul>
              <button className="pricing-btn" onClick={handleGetStarted}>
                Começar Agora
              </button>
            </div>

            {/* Plano Anual - Destaque */}
            <div className="pricing-card pricing-featured">
              <div className="pricing-badge">
                <span>🔥 Melhor Opção</span>
              </div>
              <div className="pricing-header">
                <h3>Anual</h3>
                <p>Economize 63% no ano</p>
              </div>
              <div className="pricing-price">
                <span className="price-currency">R$</span>
                <span className="price-amount">297</span>
                <span className="price-period">/ano</span>
              </div>
              <div className="pricing-savings">
                <span className="savings-badge">Economize R$ 507 por ano</span>
              </div>
              <ul className="pricing-features">
                <li>
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  <span><strong>Tudo do plano Mensal</strong></span>
                </li>
                <li>
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  <span>Apenas R$ 24,75 por mês</span>
                </li>
                <li>
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  <span>Suporte prioritário</span>
                </li>
                <li>
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  <span>Atualizações e novos recursos</span>
                </li>
                <li>
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  <span>Garantia de 7 dias</span>
                </li>
                <li>
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  <span>Sem fidelidade - cancele quando quiser</span>
                </li>
              </ul>
              <button className="pricing-btn pricing-btn-featured" onClick={handleGetStarted}>
                Começar Agora
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="faq-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Perguntas Frequentes</h2>
          </div>

          <div className="faq-grid">
            <div className="faq-item">
              <h3>Como funciona a clonagem de páginas?</h3>
              <p>
                Nossa ferramenta captura o HTML completo da página, incluindo CSS e estrutura. 
                Depois, você pode editar visualmente qualquer elemento e baixar o resultado final.
              </p>
            </div>

            <div className="faq-item">
              <h3>Posso clonar qualquer site?</h3>
              <p>
                Sim! Nossa ferramenta funciona com a maioria dos sites públicos. Páginas protegidas 
                por login ou com bloqueios específicos podem ter limitações.
              </p>
            </div>

            <div className="faq-item">
              <h3>Os códigos injetados funcionam offline?</h3>
              <p>
                Sim! Os códigos de rastreamento (Pixel, GTM, etc) são injetados diretamente no HTML. 
                Quando você baixa e hospeda a página, eles funcionam normalmente.
              </p>
            </div>

            <div className="faq-item">
              <h3>O plano anual tem fidelidade?</h3>
              <p>
                Não! Você pode cancelar quando quiser. Oferecemos garantia de 7 dias para reembolso 
                caso não fique satisfeito.
              </p>
            </div>

            <div className="faq-item">
              <h3>Preciso saber programar para usar?</h3>
              <p>
                Não! Nossa interface é 100% visual e intuitiva. Qualquer pessoa pode clonar e 
                editar páginas sem conhecimento técnico.
              </p>
            </div>

            <div className="faq-item">
              <h3>Qual o limite de clonagens?</h3>
              <p>
                Não há limite! Você pode clonar quantas páginas quiser, editar e baixar sem 
                restrições em qualquer plano.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-background-image">
          <img 
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1400&auto=format&fit=crop" 
            alt="Equipe trabalhando"
          />
          <div className="cta-overlay"></div>
        </div>
        <div className="cta-container">
          <div className="cta-content">
            <h2>Pronto para começar?</h2>
            <p>
              Junte-se a milhares de profissionais que já estão clonando páginas 
              com eficiência e rapidez.
            </p>
            <button className="btn-primary btn-large" onClick={handleGetStarted}>
              <span>Começar Agora</span>
              <span className="btn-arrow">→</span>
            </button>
            <p className="cta-note">
              ✓ Use por 7 dias &nbsp;&nbsp; ✓ Não gostou? Peça seu dinheiro de volta &nbsp;&nbsp; ✓ Cancele quando quiser
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <img src="/spycopy-logo.png" alt="Clone Pages" className="footer-logo" />
            <p className="footer-description">
              A ferramenta profissional de clonagem e edição de páginas web. 
              Simples, rápida e poderosa.
            </p>
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <h4>Produto</h4>
              <a href="#features">Recursos</a>
              <a href="#pricing">Preços</a>
              <a href="#faq">FAQ</a>
            </div>
            <div className="footer-column">
              <h4>Suporte</h4>
              <a href="mailto:suporte@spytools.com.br">suporte@spytools.com.br</a>
              <a href="#faq">Central de Ajuda</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2024 Clone Pages. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

