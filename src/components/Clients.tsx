import React from 'react';
import { useTranslation } from 'react-i18next';

// Import client logos
import novolizLogo from '../assets/grupoandina.jpg';
import pozoAltoLogo from '../assets/vivero_arona_logo.jpg';
import lxgLogo from '../assets/HM-CLAUSE.jpg';
import hefeiLogo from '../assets/ROOTS-PERU.jpg';
import rootsLogo from '../assets/agrokr.jpg';
import agrokrLogo from '../assets/agrovision.jpg';
import avoamericaLogo from '../assets/avoamerica3.png';
import fallcreekLogo from '../assets/fallcreek.png';
import natuperuLogo from '../assets/natuperu.png';

const Clients: React.FC = () => {
  const { t } = useTranslation();
  const clientLogos = [
    { src: novolizLogo, alt: 'Grupo Andina' },
    { src: pozoAltoLogo, alt: 'Vivero Arona' },
    { src: lxgLogo, alt: 'HM-CLAUSE' },
    { src: hefeiLogo, alt: 'ROOTS-PERU' },
    { src: rootsLogo, alt: 'Agrokr' },
    { src: agrokrLogo, alt: 'Agrovision' },
    { src: avoamericaLogo, alt: 'Avoamerica' },
    { src: fallcreekLogo, alt: 'Fall Creek' },
    { src: natuperuLogo, alt: 'NatuPerú' }
  ];

  return (
    <section className="py-20 bg-tractor-200 text-white">
      <div className="max-w-7xl mx-auto px-4 text-center ">
        <h2 className="text-4xl sm:text-5xl font-extrabold mb-6">
          {t('clients.title')}
        </h2>
        <p className="text-lg sm:text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
          {t('clients.subtitle')}
        </p>

        {/* Carrusel infinito con animación horizontal */}
        <div className="relative w-full overflow-hidden">
          <div className="animate-marquee whitespace-nowrap flex items-center gap-8">
            {[...clientLogos, ...clientLogos].map((logo, index) => (
              <div
                key={index}
                className="flex-shrink-0 bg-white rounded-xl shadow-xl p-4 w-40 h-28 flex items-center justify-center hover:scale-105 transition-transform duration-300"
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>


      </div>

      {/* Animación CSS */}
      <style>
        {`
          @keyframes marquee {
            0%   { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }

          .animate-marquee {
            animation: marquee 30s linear infinite;
          }
        `}
      </style>
    </section>
  );
};

export default Clients;
