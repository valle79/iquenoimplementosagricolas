import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FaWhatsapp, FaFacebook, FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

import portada1 from '../assets/portada1.jpg';
import portada2 from '../assets/portada2.jpg';
import portada3 from '../assets/papas_cajaimportada.png';
import portada4 from "../assets/Abonadora-Fertilizadora-Hidraulica.jpg";

const slides = [
  { url: portada1, key: 'hero.slide1' },
  { url: portada2, key: 'hero.slide2' },
  { url: portada3, key: 'hero.slide3' },
  { url: portada4, key: 'hero.slide4' },
];

const HeroCarousel: React.FC = () => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [showSocial, setShowSocial] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const leaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSocialOpen = showSocial || isHovered;

  const handleMouseEnter = () => {
    if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    leaveTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
      setShowSocial(false);
    }, 300);
  };
  const images = slides.map((s) => ({ url: s.url, title: t(s.key) }));

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    goToSlide(newIndex);
  };

  const goToNext = () => {
    const newIndex = (currentIndex + 1) % images.length;
    goToSlide(newIndex);
  };

  return (
    <div className="relative h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-[90vh] overflow-hidden">
      {/* Imágenes del carrusel */}
      <div className="relative h-full">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ 
                backgroundImage: `url(${image.url})`,
                backgroundPosition: 'center center',
                transform: 'scale(1.02)'
              }}
            />
          </div>
        ))}
      </div>

      {/* Contenido */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-white max-w-2xl mx-auto text-center sm:text-left sm:mx-0 relative z-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 transition-opacity duration-500">
              {images[currentIndex].title}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center max-w-[280px] sm:max-w-none mx-auto sm:mx-0">
              <a 
                href="#contacto"
                className="w-full sm:w-auto bg-machinery-200 text-tractor-400 px-6 py-3 rounded-lg font-semibold hover:bg-machinery-300 transition duration-300 inline-flex items-center justify-center text-sm sm:text-base hover:scale-105"
              >
                  <span>{t('nav.contact')}</span>
                <ChevronRight className="ml-2 h-4 w-4" />
              </a>
              <a 
                href="#maquinarias"
                className="w-full sm:w-auto bg-tractor-200 text-white px-6 py-3 rounded-lg font-semibold hover:bg-tractor-300 transition duration-300 inline-flex items-center justify-center text-sm sm:text-base hover:scale-105"
              >
                  <span>{t('nav.viewProducts')}</span>
                <ChevronRight className="ml-2 h-4 w-4" />
              </a>
              <a 
                href="/catalogoactual.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-machinery-200 text-tractor-400 px-6 py-3 rounded-lg font-semibold hover:bg-machinery-300 transition duration-300 inline-flex items-center justify-center text-sm sm:text-base hover:scale-105"
              >
                  <span>{t('nav.catalog')}</span>
                <ChevronRight className="ml-2 h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Controles del carrusel */}
      <div className="absolute inset-y-0 left-0 flex items-center">
        <button
          onClick={goToPrevious}
          className="bg-black bg-opacity-50 text-white p-2 m-4 rounded-full hover:bg-opacity-75 transition-all focus:outline-none focus:ring-2 focus:ring-white/50"
          aria-label="Anterior"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-center">
        <button
          onClick={goToNext}
          className="bg-black bg-opacity-50 text-white p-2 m-4 rounded-full hover:bg-opacity-75 transition-all focus:outline-none focus:ring-2 focus:ring-white/50"
          aria-label="Siguiente"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Indicadores */}
      <div className="absolute bottom-4 left-0 right-0">
        <div className="flex justify-center gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-white scale-125'
                  : 'bg-white bg-opacity-50 hover:bg-opacity-75'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Social media floating radial menu */}
      <div
        className="fixed right-12 top-1/2 -translate-y-1/2 z-50"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative" style={{ width: 0, height: 0 }}>
          <button
            onClick={(e) => { e.stopPropagation(); if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current); setShowSocial((prev) => !prev); }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white hover:shadow-xl transition-all active:scale-95 z-10"
            aria-label="Redes sociales"
            title="Redes sociales"
          >
            <div className="grid grid-cols-2 gap-px w-6 h-6 place-items-center">
              <FaWhatsapp className="text-green-500 w-2.5 h-2.5" />
              <FaFacebook className="text-blue-600 w-2.5 h-2.5" />
              <FaInstagram className="text-pink-500 w-2.5 h-2.5" />
              <FaTiktok className="text-black w-2.5 h-2.5" />
            </div>
          </button>
          {(() => {
            const RADIUS = 72;
            const links = [
              { Icon: FaWhatsapp, color: 'text-green-500', href: 'https://wa.me/51958840599', label: 'WhatsApp', angle: 120 },
              { Icon: FaFacebook, color: 'text-blue-600', href: 'https://www.facebook.com/implementosagricolas.lima', label: 'Facebook', angle: 150 },
              { Icon: FaInstagram, color: 'text-pink-500', href: 'https://www.instagram.com/fsi.implementos.agricolas/', label: 'Instagram', angle: 180 },
              { Icon: FaTiktok, color: 'text-black', href: 'https://www.tiktok.com/@www.fsi.com', label: 'TikTok', angle: 210 },
              { Icon: FaYoutube, color: 'text-red-600', href: 'https://www.youtube.com/@fsisaceliqueno', label: 'YouTube', angle: 240 },
            ];
            return links.map((link, index) => {
              const angleRad = (link.angle * Math.PI) / 180;
              const x = RADIUS * Math.cos(angleRad);
              const y = RADIUS * Math.sin(angleRad);
              return (
                <a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  title={link.label}
                  className="absolute left-1/2 top-1/2 bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300"
                  style={{
                    transform: isSocialOpen
                      ? `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
                      : 'translate(-50%, -50%)',
                    opacity: isSocialOpen ? 1 : 0,
                    pointerEvents: isSocialOpen ? 'auto' : 'none',
                    transitionDelay: isSocialOpen ? `${index * 60}ms` : '0ms',
                  }}
                >
                  <link.Icon className={`${link.color} h-5 w-5`} />
                </a>
              );
            });
          })()}
        </div>
      </div>
    </div>
  );
};

export default HeroCarousel;
