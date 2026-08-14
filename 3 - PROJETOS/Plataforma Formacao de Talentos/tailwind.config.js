/** @type {import('tailwindcss').Config} */
// =============================================================
// SEÇÃO 1 — CONFIGURAÇÃO DE ESTILO — IDENTIDADE ZELLO (Laranja & Preto)
// Tokens semânticos remapeados para o tema oficial da Zello.
// =============================================================
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // --- Namespace oficial da marca Zello ---
        zello: {
          dark: '#0B0F19',
          card: '#161B28',
          border: '#27272A',
          orange: '#FF6B00',
          amber: '#F59E0B',
          text: '#FFFFFF',
          muted: '#A1A1AA',
        },

        // --- Tokens semânticos (apontam para as cores Zello) ---
        // Fundo principal (Background) — Preto Profundo
        deep: '#0B0F19',
        // Containers e Cards — Preto Elevado
        elevated: '#161B28',
        // Bordas e Divisores — Cinza Chumbo
        line: '#27272A',
        // Cor Primária (Ações e Botões CTA) — Laranja Vibrante Zello
        primary: {
          DEFAULT: '#FF6B00',
          hover: '#E85D00',
        },
        // Destaques / Progresso / Certificados — Âmbar/Laranja Alerta
        accent: {
          DEFAULT: '#F59E0B',
          hover: '#D97706',
        },
        // Texto Principal — Branco
        ice: '#FFFFFF',
        // Texto Secundário — Cinza Médio (Zello)
        silver: '#888888',
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        xl2: '1rem',
      },
      boxShadow: {
        // Glow laranja Zello para botões/ações e destaques âmbar.
        glow: '0 0 0 1px rgba(255,107,0,0.35), 0 8px 30px -12px rgba(255,107,0,0.5)',
        'glow-accent': '0 0 0 1px rgba(245,158,11,0.35), 0 8px 30px -12px rgba(245,158,11,0.5)',
        // Sombra de painel/glass (do guia Zello).
        panel: '0 1px 2px rgba(0,0,0,0.18), 0 8px 24px rgba(0,0,0,0.12)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseRing: {
          '0%,100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.35s ease-out both',
        'pulse-ring': 'pulseRing 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
