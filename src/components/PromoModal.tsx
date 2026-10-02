import React, { useState, useEffect, useRef } from 'react';
import { X, Tag, Clock, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { fetchPromotions } from '../lib/api';

import type { PromoData } from '../types';

interface PromoModalProps {
  onClose: () => void;
}

// El texto de la promoción llega como texto plano con saltos de línea.
// Lo separamos en líneas para poder maquetarlas una por una.
const splitLines = (text: string): string[] =>
  text
    .split(/\r\n|\r|\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

// El cierre de la descripción (teléfono, web, dirección, cierre comercial y
// firma de la empresa) ya aparece en el resto de la web, así que en el modal
// solo mostramos la introducción y la lista de ventajas (líneas con ✅).
const getDescriptionLines = (text: string): string[] => {
  const lines = splitLines(text);

  let end = lines.length;
  for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].startsWith('\u2705')) {
      end = i + 1;
      break;
    }
  }

  return lines.slice(0, end);
};

const PromoModal: React.FC<PromoModalProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [promos, setPromos] = useState<PromoData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    fetchActivePromos();
  }, []);

  useEffect(() => {
    if (promos.length > 0) {
      // Mostrar inmediatamente sin delay
      setIsVisible(true);
    }
  }, [promos]);

  // Auto-slide dinámico: más tiempo para videos, menos para imágenes
  useEffect(() => {
    if (promos.length > 1) {
      const currentPromo = promos[currentIndex];
      const slideTime = currentPromo.mediaType === 'video' ? 26000 : 5000;
      
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % promos.length);
      }, slideTime);
      
      return () => clearInterval(interval);
    }
  }, [promos.length, currentIndex, promos]);

  const fetchActivePromos = async () => {
    try {
      const promos = await fetchPromotions();
      if (promos && promos.length > 0) {
        setPromos(promos);
      }
    } catch (error) {
      console.error('Error al cargar promociones:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleWhatsAppClick = () => {
    if (promos.length === 0) return;
    const currentPromo = promos[currentIndex];
    const message = encodeURIComponent(`Hola! Me interesa la oferta de ${currentPromo.title}`);
    const whatsappUrl = `https://wa.me/51958840599?text=${message}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    handleClose();
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + promos.length) % promos.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % promos.length);
  };

  const handleVideoClick = () => {
    if (!videoRef.current) return;
    if (isMuted) {
      setIsMuted(false);
      // Si el click nativo del navegador pausó el video, reanudarlo con audio
      if (videoRef.current.paused) {
        videoRef.current.play().catch(() => {});
      }
    }
  };

  if (loading) return null;
  if (promos.length === 0) return null;
  
  const currentPromo = promos[currentIndex];
  

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop con blur */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal Container */}
          <motion.div
            className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] md:max-h-[95vh]"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 z-10 p-2 transition-all duration-300 hover:scale-110 group"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5 md:w-6 md:h-6 text-gray-700 group-hover:text-red-500 transition-colors" />
            </button>

            {/* Indicador de múltiples promociones */}
            {promos.length > 1 && (
              <div className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
                <span className="text-xs font-semibold text-gray-700">
                  {currentIndex + 1} / {promos.length}
                </span>
              </div>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
                className="relative md:grid md:grid-cols-2 gap-0 h-full"
              >
                {/* Left Side - Image or Video (Full screen en móvil) */}
                <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden flex flex-col items-center justify-center md:p-4 w-full h-[60vh] md:h-auto">
                  {/* Contenedor con aspect-ratio consistente */}
                  <div className="w-full h-full overflow-hidden flex items-center justify-center">
                    {/* Overlay sutil para móvil */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20 md:hidden pointer-events-none z-10"></div>
                    
                    {currentPromo.mediaType === 'video' ? (
                      <motion.video
                        ref={videoRef}
                        src={currentPromo.image}
                        className="w-full h-full object-contain bg-black md:drop-shadow-xl"
                        initial={{ scale: 1.05 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.4 }}
                        controls
                        autoPlay
                        muted={isMuted}
                        onClick={handleVideoClick}
                        loop
                        playsInline
                        preload="metadata"
                      />
                    ) : (
                      <motion.img
                        src={currentPromo.image}
                        alt={currentPromo.title}
                        className="w-full h-full object-contain md:drop-shadow-xl"
                        initial={{ scale: 1.05 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.4 }}
                      />
                    )}
                  </div>
                  <motion.div
                    className="absolute top-4 left-3 md:top-5 md:left-4 bg-red-500 text-white px-2.5 py-1.5 md:px-3 md:py-1.5 rounded-lg md:rounded-lg shadow-xl z-20 backdrop-blur-sm"
                    initial={{ rotate: -12, scale: 0 }}
                    animate={{ rotate: -12, scale: 1 }}
                    transition={{ delay: 0.1, type: "spring", duration: 0.3 }}
                  >
                    <div className="flex items-center space-x-1 md:space-x-1.5">
                      <Tag className="w-3.5 h-3.5 md:w-3.5 md:h-3.5" />
                      <span className="text-base md:text-lg font-black">{t('promo.badge')}</span>
                    </div>
                  </motion.div>

                  {/* Validity Badge */}
                  <motion.div
                    className="absolute bottom-14 left-3 md:bottom-14 md:left-4 bg-white/95 backdrop-blur-sm px-2.5 py-1 md:px-3 md:py-1.5 rounded-lg shadow-md z-20"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                  >
                    <div className="flex items-center space-x-1 md:space-x-1.5 text-xs md:text-sm">
                      <Clock className="w-3 h-3 md:w-3.5 md:h-3.5 text-tractor-200" />
                      <span className="text-gray-700 font-semibold">{t('promo.validUntil')} {currentPromo.validUntil}</span>
                    </div>
                  </motion.div>

                  {/* Banner promocional animado - Debajo de "Válido hasta" */}
                  <motion.div
                    className="hidden md:block absolute bottom-3 left-3 md:bottom-3 md:left-4 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 text-gray-900 py-1.5 px-2.5 rounded-lg shadow-md overflow-hidden z-20"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                  >
                    {/* Efecto de brillo animado */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
                      animate={{
                        x: ['-100%', '100%']
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 1
                      }}
                    />
                    <div className="relative flex items-center justify-center space-x-1.5 md:space-x-2">
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Tag className="w-3 h-3 md:w-4 md:h-4" />
                      </motion.div>
                      <span className="text-[10px] md:text-xs font-black uppercase tracking-wider">
                        {t('promo.limitedTime')}
                      </span>
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        ⚡
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Botón WhatsApp flotante (Solo móvil) - Posición abajo izquierda */}
                  <motion.button
                    onClick={handleWhatsAppClick}
                    className="md:hidden absolute bottom-3 left-3 bg-tractor-200 text-white px-4 py-2 rounded-full font-bold text-sm shadow-2xl flex items-center space-x-1.5 hover:bg-tractor-300 active:scale-95 transition-all duration-200 z-20 backdrop-blur-sm"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{t('promo.buy')}</span>
                  </motion.button>
                </div>

                {/* Right Side - Content (Oculto en móvil) */}
                <div className="hidden md:flex p-6 md:p-7 flex-col justify-between">
                  {/* Badge */}
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <span className="inline-block bg-gradient-to-r from-machinery-200 to-machinery-300 text-tractor-700 px-2.5 py-0.5 md:px-3 md:py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-md">
                      {t('promo.offerLabel')}
                    </span>
                  </motion.div>

                  {/* Title */}
                  <motion.div
                    className="mt-4"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h2 className="text-xl md:text-2xl font-black text-tractor-700 leading-tight mb-1 pr-4">
                      {currentPromo.title}
                    </h2>
                    {currentPromo.subtitle && (
                      <p className="text-sm md:text-base text-tractor-200 font-semibold">
                        {currentPromo.subtitle}
                      </p>
                    )}
                  </motion.div>

                  {/* Description */}
                  <motion.div
                    className="mt-3 md:mt-4 text-gray-600 leading-relaxed text-sm min-h-0 flex-1 overflow-y-auto pr-1"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    {getDescriptionLines(currentPromo.features).map((line, i) => (
                      <p key={i} className="break-words mb-1.5 last:mb-0">
                        {line}
                      </p>
                    ))}
                  </motion.div>

                  {/* CTA Button - Solo WhatsApp */}
                  <motion.div
                    className="mt-5 md:mt-6"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    <button
                      onClick={handleWhatsAppClick}
                      className="w-full bg-tractor-200 text-white px-5 py-3 rounded-xl font-bold text-base hover:bg-tractor-300 hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center space-x-2 group"
                    >
                      <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span>{t('promo.buy')}</span>
                    </button>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Botones de navegación (solo si hay múltiples promociones) */}
            {promos.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-1 md:left-2 top-1/2 -translate-y-1/2 z-30 bg-white/80 md:bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all hover:scale-110"
                  aria-label={t('promo.previous')}
                >
                  <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-1 md:right-2 top-1/2 -translate-y-1/2 z-30 bg-white/80 md:bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all hover:scale-110"
                  aria-label={t('promo.next')}
                >
                  <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
                </button>

                {/* Indicadores de puntos */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
                  {promos.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentIndex
                          ? 'bg-tractor-200 w-6'
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                      aria-label={`Ir a promoción ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PromoModal;