import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Phone, Mail, MapPin, ChevronRight, Users, Building, Target } from 'lucide-react';
import ContactForm from './components/ContactForm';
import MachineGallery from './components/MachineGallery';
import SparePartsGallery from './components/SparePartsGallery';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Testimonials from './components/Testimonials';
import Alert from './components/Alert';
import VideoGallery from './components/VideoGallery';
import Advisors from './components/Advisors';
import Map from './components/Map';
import Clients from './components/Clients';
import Logo from './components/Logo';
import HeroCarousel from './components/HeroCarousel';
import AnimatedCounter from './components/AnimatedCounter';
import PromoModal from './components/PromoModal';
import LanguageSwitcher from './components/LanguageSwitcher';
import image1 from './assets/portada1.jpg';
import image2 from './assets/portada2.jpg';
import image3 from './assets/portada3.jpg';
import image4 from './assets/Abonadora-Fertilizadora-Hidraulica.jpg';
import image5 from './assets/camara-comercio-lima.png';
import { Bot } from "lucide-react"; // 👈 importa el icono de robot

// Extiende la interfaz Window para incluir Chatbase
declare global {
  interface Window {
    chatbase?: {
      (method: string, ...args: unknown[]): void;
      q?: unknown[];
      getState?: () => string;
    };
  }
}

function App() {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [isChatbotLoaded, setIsChatbotLoaded] = useState(false);
  const [chatbotError, setChatbotError] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState('');

  const [showTopBar, setShowTopBar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showPromoModal, setShowPromoModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);  // Ref para el script del chatbot

  // Mostrar modal de promoción al cargar la página (siempre)
  useEffect(() => {
    setShowPromoModal(true);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleContactSuccess = () => {
    setAlertMessage(t('contact.formSuccess'));
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };


// Cargar el script de Chatbase
  useEffect(() => {
    // Inicializar la cola de comandos de Chatbase
    if (!window.chatbase || window.chatbase.getState?.() !== 'initialized') {
      window.chatbase = (...args) => {
        if (window.chatbase && !window.chatbase.q) window.chatbase.q = [];
        window.chatbase?.q?.push(args);
      };
      window.chatbase = new Proxy(window.chatbase, {
        get(target, prop) {
          if (prop === 'q') return target.q;
          if (typeof prop === 'string') {
            return (...args: unknown[]) => target(prop, ...args);
          }
          return undefined;
        },
      });
    }

    // Verificar si el script ya está cargado
    if (!document.querySelector("script[id='VFvg22QWfY7w7D_axwc-m']")) {
      const onLoad = () => {
        const script = document.createElement('script');
        script.src = 'https://www.chatbase.co/embed.min.js';
        script.id = 'VFvg22QWfY7w7D_axwc-m';
        script.setAttribute('domain', 'www.chatbase.co');
        script.defer = true;
        script.async = true; // Agregar async para mejor rendimiento

        script.onload = () => {
          setIsChatbotLoaded(true);
          // Deshabilitar comportamientos automáticos del chatbot
          setTimeout(() => {
            if (window.chatbase) {
              try {
                window.chatbase('close'); // Asegurar que esté cerrado inicialmente
              } catch (error) {
                console.warn('Chatbot initialization warning:', error);
              }
            }
          }, 100);
        };

        script.onerror = () => {
          setChatbotError('Error al cargar el script del chatbot. Verifica tu conexión o el ID.');
        };

        document.body.appendChild(script);
        scriptRef.current = script;
      };

      if (document.readyState === 'complete') {
        onLoad();
      } else {
        window.addEventListener('load', onLoad);
        return () => window.removeEventListener('load', onLoad);
      }
    }

    // Cleanup al desmontar
    return () => {
      if (scriptRef.current && scriptRef.current.parentNode) {
        scriptRef.current.parentNode.removeChild(scriptRef.current);
      }
      setIsChatbotLoaded(false);
    };
  }, []);

  // Ocultar el ícono flotante nativo de Chatbase y ajustar el tamaño del widget en móviles
  useEffect(() => {
    if (isChatbotLoaded) {
      const style = document.createElement('style');
      style.innerHTML = `
        #chatbase-bubble-button, .chatbase-bubble-button {
          display: none !important;
        }
        #chatbase-bubble-window {
          z-index: 9999 !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
          border-radius: 12px !important;
          position: fixed !important;
          transform: translateZ(0) !important;
          will-change: transform !important;
        }
        @media (max-width: 640px) {
          #chatbase-bubble-window {
            width: 90% !important;
            max-width: 360px !important;
            height: 70vh !important;
            bottom: 80px !important;
            left: 50% !important;
            transform: translateX(-50%) translateZ(0) !important;
            right: auto !important;
          }
        }
        @media (min-width: 641px) {
          #chatbase-bubble-window {
            width: 400px !important;
            height: 600px !important;
            bottom: 80px !important;
            right: 20px !important;
            left: auto !important;
            transform: translateZ(0) !important;
          }
        }
      `;
      document.head.appendChild(style);
      return () => {
        document.head.removeChild(style);
      };
    }
  }, [isChatbotLoaded]);

  // Mostrar errores del chatbot
  useEffect(() => {
    if (chatbotError) {
      setAlertMessage(chatbotError);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 5000);
    }
  }, [chatbotError]);

  // Cerrar el chatbot al hacer clic fuera - VERSION SIMPLIFICADA
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const chatWindow = document.getElementById('chatbase-bubble-window');
      const chatButton = document.getElementById('agroChatButton');
      const target = event.target as HTMLElement;
      
      // Solo ejecutar si el chatbot está abierto y visible
      if (
        isChatbotLoaded &&
        chatWindow &&
        chatWindow.style.display !== 'none' &&
        !chatWindow.contains(target) &&
        chatButton &&
        !chatButton.contains(target)
      ) {
        try {
          if (window.chatbase) {
            window.chatbase('close');
          }
        } catch (error) {
          console.warn('Error cerrando chatbot:', error);
        }
      }
    };

    // Solo agregar el listener si el chatbot está cargado
    if (isChatbotLoaded) {
      // Usar timeout para evitar conflictos inmediatos
      setTimeout(() => {
        document.addEventListener('click', handleClickOutside, { passive: true });
      }, 100);
      
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [isChatbotLoaded]);

  // Función para abrir el chatbot - VERSIÓN SIMPLIFICADA
  const openChatbot = () => {
    if (isChatbotLoaded && window.chatbase) {
      try {
        window.chatbase('open');
      } catch (error) {
        setChatbotError('No se pudo abrir el chatbot. Intenta de nuevo.');
      }
    } else {
      setChatbotError('El chatbot aún no está cargado. Por favor, espera un momento.');
    }
  };




  const menuItems = [
    { href: '#inicio', label: t('nav.home') },
    { href: '#quienes-somos', label: t('nav.about') },
    { href: '#maquinarias', label: t('nav.machinery') },
    { href: '#repuestos', label: t('nav.spareparts') },
    { href: '#videos', label: t('nav.videos') },
    { href: '#testimonios', label: t('nav.testimonials') },
    { href: '#asesores', label: t('nav.advisors') },
  ];

  // Variantes de animación para secciones (entrada desde lados alternados)
  const sectionVariants = {
    hidden: (index: number) => ({
      opacity: 0,
      x: index % 2 === 0 ? -100 : 100,
      scale: 0.95,
    }),
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        delay: 0.1,
        duration: 0.6,
        ease: [0.43, 0.13, 0.23, 0.96],
      },
    },
  };

  // Variantes de animación para cards dentro de secciones
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.05,
        duration: 0.5,
        ease: [0.43, 0.13, 0.23, 0.96],
      },
    }),
    hover: {
      scale: 1.05,
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  };

// SOLO bloquear clic derecho, F12 y Ctrl+U - SIN otros event listeners
useEffect(() => {


  // Bloquear F12 y Ctrl+U
  const disableKeys = (e: KeyboardEvent) => {
    if (e.key === "F12") {
      e.preventDefault();
    }
    if (e.ctrlKey && e.key.toLowerCase() === "u") {
      e.preventDefault();
    }
  };

  // Solo eventos necesarios

  document.addEventListener("keydown", disableKeys);

  // Cleanup
  return () => {

    document.removeEventListener("keydown", disableKeys);
  };
}, []);


  // Efecto para cerrar el menú al hacer clic fuera en móviles
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      if (isMenuOpen && menuRef.current && !menuRef.current.contains(target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Prevenir scroll del body cuando el menú móvil está abierto
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isMenuOpen]);

  // Efecto para ocultar/mostrar la barra superior al hacer scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down & past 100px
        setShowTopBar(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up
        setShowTopBar(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <div className="min-h-screen bg-tractor-50 overflow-x-hidden">
      {/* Promo Modal */}
      {showPromoModal && <PromoModal onClose={() => setShowPromoModal(false)} />}
      
      {/* Navigation - Diseño Invertido */}
      <nav className="bg-white text-gray-800 fixed w-full z-50 shadow-2xl border-b border-gray-200">
        {/* Barra superior verde - Solo información de contacto */}
        <div className={`bg-tractor-200 text-white transition-all duration-500 ease-in-out overflow-hidden ${
          showTopBar ? 'h-12 opacity-100' : 'h-0 opacity-0'
        }`}>
          <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-12">
              {/* Información de contacto centrada */}
              <div className="hidden md:flex items-center justify-center w-full space-x-8">
                <div className="flex items-center space-x-2 text-machinery-100 text-sm">
                  <Mail className="h-4 w-4" />
                  <span>eliquenosac.lili@gmail.com</span>
                </div>
                <div className="flex items-center space-x-2 text-machinery-100 text-sm">
                  <MapPin className="h-4 w-4" />
                  <span>Jr. Augusto B. Leguia n 523. Imperial Cañete Lima</span>
                </div>
                <div className="flex items-center space-x-2 text-white font-semibold text-sm">
                  <Phone className="h-4 w-4" />
                  <a href="tel:+51958840599" className="hover:text-machinery-200 transition-colors duration-300">
                    +51 958 840 599
                  </a>
                </div>
              </div>

              {/* Solo teléfono en móvil */}
              <div className="md:hidden flex items-center justify-center w-full space-x-2 text-white font-semibold text-sm">
                <Phone className="h-4 w-4" />
                <a href="tel:+51958840599" className="hover:text-machinery-200 transition-colors duration-300">
                  +51 958 840 599
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Navbar principal blanco con todo el contenido */}
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo en el navbar blanco - Solo imagen */}
            <motion.div 
              className="flex items-center"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <Logo height={50} showText={false} variant="topbar" />
            </motion.div>

            {/* Desktop Navigation - Moderno y Centrado */}
            <div className="hidden lg:flex items-center justify-center flex-1 mx-16">
              <div className="flex items-center justify-start space-x-0 ">
                {menuItems.map((item, index) => (
                  <motion.a
                    key={item.href}
                    href={item.href}
                    className="relative px-6 py-3 text-sm font-semibold text-gray-600 hover:text-[#2d5a96] transition-all duration-300 rounded-xl border-2 border-transparent hover:border-green-500 hover:bg-green-50/50"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className="relative z-10">{item.label}</span>
                    <div className="absolute inset-0 bg-white rounded-xl scale-0 group-hover:scale-100 transition-transform duration-300 shadow-md"></div>
                    <div className="absolute inset-0 bg-tractor-200/10 rounded-xl scale-0 group-hover:scale-100 transition-transform duration-300 delay-75"></div>
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Language Switcher + CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <LanguageSwitcher />
              <motion.a
                href="#contacto"
                className="px-5 py-2 bg-tractor-200 text-white rounded-lg font-semibold text-sm hover:bg-tractor-300 transition-all duration-300 shadow-sm"                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex items-center space-x-2">
                  <span>{t('nav.contact')}</span>
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </motion.a>
            </div>

            {/* Mobile: Language Switcher + Menu button */}
            <div className="lg:hidden flex items-center gap-2">
              <LanguageSwitcher />
              {/* Mobile menu button */}
            <motion.div
              className="lg:hidden"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <button 
                onClick={toggleMenu} 
                className="relative p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-300 group"
                aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              >
                <div className="w-6 h-6 flex flex-col justify-center items-center">
                  <span className={`block w-5 h-0.5 bg-gray-700 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'}`}></span>
                  <span className={`block w-5 h-0.5 bg-gray-700 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                  <span className={`block w-5 h-0.5 bg-gray-700 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'}`}></span>
                </div>
              </button>
            </motion.div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              ref={menuRef}
              className="bg-tractor-200 h-full w-64 max-w-sm shadow-xl flex flex-col"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
<div className="relative px-5 pt-6">
  <div className="flex justify-center">
    <div className="bg-white rounded-lg p-2">
      <Logo height={54} showText={true} variant="topbar" />
    </div>
  </div>

  <motion.button
    onClick={() => setIsMenuOpen(false)}
    className="absolute top-6 text-white/60 hover:text-white transition-colors"
    whileTap={{ scale: 0.9 }}
  >
    <X className="h-5 w-5" />
  </motion.button>
</div>

              <nav className="flex-1 px-4 pt-6 pb-2 space-y-1">
                {menuItems.map((item, index) => (
                  <motion.a
                    key={item.href}
                    href={item.href}
                    className="block px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-lg text-sm font-medium transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.04 }}
                  >
                    {item.label}
                  </motion.a>
                ))}
              </nav>

              <div className="px-4 pb-5 pt-3 border-t border-white/10">
                <a
                  href="#contacto"
                  className="block w-full px-3 py-2 bg-machinery-200 text-tractor-700 text-xs font-semibold rounded-lg text-center hover:bg-machinery-300 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contáctanos
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </nav>
      {/* Hero Section */}
      <motion.section
        id="inicio"
        className="relative"
        custom={0}
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <HeroCarousel />
      </motion.section>
      {/* About Us Section */}
      <motion.section
        id="quienes-somos"
        className="py-24 bg-white"
        custom={1}
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            className="text-3xl font-extrabold text-center mb-6 text-tractor-200 tracking-tight"
            custom={0}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {t('about.title')}
          </motion.h2>
          <motion.h2
            className=" font-bold text-center  text-tractor-200"
            custom={0}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {t('about.subtitle')}
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <motion.h3
                className="text-2xl font-bold text-tractor-200"
                custom={0}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {t('about.historyTitle')}
              </motion.h3>
              <motion.p
                className="text-gray-600 leading-relaxed"
                custom={1}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {t('about.historyText')}
              </motion.p>
              <motion.h3
                className="text-2xl font-bold text-tractor-200"
                custom={2}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {t('about.missionTitle')}
              </motion.h3>
              <motion.p
                className="text-gray-600 leading-relaxed"
                custom={3}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {t('about.missionText')}
              </motion.p>
              <div className="grid grid-cols-2 gap-6 mt-8">
                <motion.div
                  className="bg-tractor-50 p-6 rounded-xl text-center shadow-md"
                  custom={4}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  whileHover="hover"
                  viewport={{ once: true }}
                >
                  <AnimatedCounter target={30} suffix="+" className="text-4xl font-bold text-tractor-200 mb-2" />
                  <p className="text-gray-600">{t('about.yearsLabel')}</p>
                </motion.div>
                <motion.div
                  className="bg-machinery-50 p-6 rounded-xl text-center shadow-md"
                  custom={5}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  whileHover="hover"
                  viewport={{ once: true }}
                >
                  <AnimatedCounter target={1000} suffix="+" className="text-4xl font-bold text-machinery-200 mb-2" />
                  <p className="text-gray-600">{t('about.clientsLabel')}</p>
                </motion.div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <motion.img
                  src={image1}
                  alt="Cosechadora y maquinaria agrícola en campo peruano"
                  className="rounded-xl shadow-lg"
                  custom={6}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                />
                <motion.img
                  src={image4}
                  alt="Picadora e implemento agrícola FSI SAC"
                  className="rounded-xl shadow-lg"
                  custom={7}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                />
              </div>
              <div className="space-y-4 mt-8">
                <motion.img
                  src={image2}
                  alt="Cosechadora de papa en acción - FSI SAC"
                  className="rounded-xl shadow-lg"
                  custom={8}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                />
                <motion.img
                  src={image3}
                  alt="Desbrozadora y equipos agrícolas en Perú"
                  className="rounded-xl shadow-lg"
                  custom={9}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.section>
      {/* Services Section */}
      <motion.section
        className="py-24 bg-gradient-to-b from-tractor-50 to-tractor-100"
        custom={2}
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            className="text-3xl font-extrabold text-center mb-12 text-tractor-200 tracking-tight"
            custom={0}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {t('services.title')}
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Target className="h-6 w-6 text-machinery-50" />,
                title: t('services.fabrication'),
                description: t('services.fabricationDesc'),
                bg: 'bg-tractor-200',
              },
              {
                icon: <Building className="h-6 w-6 text-machinery-50" />,
                title: t('services.maintenance'),
                description: t('services.maintenanceDesc'),
                bg: 'bg-machinery-200',
              },
              {
                icon: <Users className="h-6 w-6 text-machinery-50" />,
                title: t('services.advisory'),
                description: t('services.advisoryDesc'),
                bg: 'bg-tractor-200',
              },
            ].map((service, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg"
                custom={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                whileHover="hover"
                viewport={{ once: true }}
              >
                <div className={`w-12 h-12 ${service.bg} rounded-full flex items-center justify-center mb-4`}>
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-tractor-700">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
      {/* Products Section */}
      <motion.section
        id="maquinarias"
        className="py-20 bg-white w-full"
        custom={3}
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="w-full px-4">
          <motion.h2
            className="text-3xl font-extrabold text-center mb-12 text-tractor-200"
            custom={0}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {t('products.title')}
          </motion.h2>
          <motion.p
            className="text-center text-gray-600 mb-12 max-w-2xl mx-auto"
            custom={1}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {t('products.description')}
          </motion.p>
          <MachineGallery />
        </div>
      </motion.section>
      {/* Spare Parts Section */}
      <motion.section
        id="repuestos"
        className="py-24 bg-gradient-to-b from-white to-gray-50"
        custom={4}
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            className="text-4xl font-extrabold text-center mb-12 text-tractor-200 tracking-tight"
            custom={0}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {t('spareParts.title')}
          </motion.h2>
          <motion.p
            className="text-center text-gray-600 mb-12 max-w-2xl mx-auto"
            custom={1}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {t('spareParts.description')}
          </motion.p>
          <SparePartsGallery />
        </div>
      </motion.section>
      {/* CTA Section */}
      <motion.section
        className="py-16 bg-tractor-200 "
        custom={5}
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.h2
            className="text-3xl font-extrabold text-white mb-6"
            custom={0}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {t('cta.title')}
          </motion.h2>
          <motion.p
            className="text-tractor-50 text-xl mb-8"
            custom={1}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {t('cta.subtitle')}
          </motion.p>
          <motion.a
            href="#contacto"
            className="bg-machinery-200 text-tractor-400 px-8 py-3 rounded-lg font-semibold hover:bg-machinery-300 transition duration-300 inline-flex items-center"
            custom={2}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            whileHover="hover"
            viewport={{ once: true }}
          >
            {t('cta.button')}
            <ChevronRight className="ml-2 h-5 w-5" />
          </motion.a>
        </div>
      </motion.section>
      {/* Video Gallery Section */}
      <motion.section
        id="videos"
        className="py-20 bg-white"
        custom={6}
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <motion.h2
            className="text-3xl font-extrabold text-center mb-12 text-tractor-200"
            custom={0}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {t('videos.title')}
          </motion.h2>
          <VideoGallery />
        </div>
      </motion.section>
      {/* Testimonials Section */}
      <motion.section
        id="testimonios"
        className="py-20 bg-tractor-50"
        custom={7}
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <motion.h2
            className="text-3xl font-extrabold text-center mb-12 text-tractor-200"
            custom={0}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {t('testimonials.title')}
          </motion.h2>
          <Testimonials />
        </div>
      </motion.section>
      {/* Advisors Section */}
      <motion.section
        id="asesores"
        className="py-20 bg-white"
        custom={8}
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <motion.h2
            className="text-3xl font-extrabold text-center mb-12 text-tractor-200"
            custom={0}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {t('advisors.title')}
          </motion.h2>
          <Advisors />
        </div>
      </motion.section>
      {/* Clients Section */}
      <motion.section
        className="py-20 bg-white"
        custom={9}
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <Clients />
      </motion.section>
      {/* Contact Section */}
      <motion.section
        id="contacto"
        className="py-20 bg-tractor-50"
        custom={10}
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <motion.h2
            className="text-3xl font-extrabold text-center mb-12 text-tractor-200"
            custom={0}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {t('contact.title')}
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <ContactForm onSuccess={handleContactSuccess} />
            </div>
            <div className="space-y-6">
              <motion.div
                className="flex items-center p-4 bg-white rounded-lg shadow-sm"
                custom={1}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <Phone className="h-6 w-6 text-tractor-200 mr-3" />
                <span>+51 958 840 599</span>
              </motion.div>
              <motion.div
                className="flex items-center p-4 bg-white rounded-lg shadow-sm"
                custom={2}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <Mail className="h-6 w-6 text-tractor-200 mr-3" />
                <span>eliquenosac.lili@gmail.com</span>
              </motion.div>
              <motion.div
                className="flex items-center p-4 bg-white rounded-lg shadow-sm"
                custom={3}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <MapPin className="h-6 w-6 text-tractor-200 mr-3" />
                <span>Jr. Augusto B. Leguia n 523. Imperial cañete Lima Perú</span>
              </motion.div>
              <motion.div
                custom={4}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <Map />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>
      {/* Footer */}
      <motion.footer
        className="bg-tractor-200 text-white py-12"
        custom={11}
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="max-w-7xl text-center mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <motion.div
                className="flex justify-center mb-4"
                custom={0}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <Logo height={55} showText={true} variant="footer" />
              </motion.div>
              <motion.p
                className="text-tractor-50"
                custom={1}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {t('footer.description')}
              </motion.p>
            </div>
            <div>
              <motion.p
                className="text-tractor-50"
                custom={0}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {t('footer.chamberAssociation')}
              </motion.p>
              <br />
              <motion.h3
                className="text-xl font-bold mb-4 flex items-center"
                custom={1}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <img src={image5} alt="Cámara de Comercio de Lima" className="h-30 w-auto" />
              </motion.h3>
            </div>
            <div>
              <motion.h3
                className="text-xl font-bold mb-4"
                custom={0}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {t('footer.quickLinks')}
              </motion.h3>
              <ul className="space-y-2">
                {menuItems.map((item, index) => (
                  <motion.li
                    key={item.href}
                    custom={index}
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    <a href={item.href} className="text-tractor-50 hover:text-white transition duration-300">
                      {item.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </div>
            <div>
              <motion.h3
                className="text-xl font-bold mb-4"
                custom={0}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {t('footer.schedule')}
              </motion.h3>
              <motion.p
                className="text-tractor-50"
                custom={1}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {t('footer.scheduleWeek')}<br />
                {t('footer.scheduleWeekAfternoon')}<br />
                {t('footer.scheduleSaturday')}<br />
                {t('footer.scheduleSaturdayAfternoon')}<br />
                {t('footer.scheduleSunday')}
              </motion.p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-tractor-300 text-center">
            <motion.p
              className="text-tractor-50"
              custom={0}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              © {new Date().getFullYear()} El Iqueño SAC. {t('footer.copyright')}
            </motion.p>
          </div>
        </div>
      </motion.footer>
      {/* Alert Component */}
      {showAlert && (
        <Alert message={alertMessage} onClose={() => setShowAlert(false)} />
      )}

<motion.div
  className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9000] pointer-events-none"
  style={{
    transform: 'translateZ(0)',
    willChange: 'transform'
  }}
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  {/* Tooltip con el texto */}
  <motion.div
    className="absolute -top-12 right-0 bg-gradient-to-r from-green-600 to-emerald-500 
               text-white text-xs sm:text-sm font-semibold px-3 py-2 
               rounded-xl shadow-lg whitespace-nowrap"
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.3, duration: 0.6 }}
  >
    🤖 {t('chatbot.tooltip')}
  </motion.div>

  {/* Botón flotante - VERSIÓN SIMPLIFICADA */}
  <motion.button
    id="agroChatButton"
    onClick={openChatbot}
    type="button"
    className="relative bg-gradient-to-r from-green-600 to-green-500 
               text-white rounded-full p-4 sm:p-5 shadow-lg flex 
               items-center justify-center pointer-events-auto"
    initial={{ scale: 1 }}
    animate={{
      scale: [1, 1.1, 1],
      boxShadow: [
        "0 0 10px rgba(16, 185, 129, 0.4)",
        "0 0 25px rgba(16, 185, 129, 0.6)",
        "0 0 10px rgba(16, 185, 129, 0.4)"
      ]
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }}
    whileHover={{
      scale: 1.2,
      rotate: 5,
      boxShadow: "0 0 30px rgba(16,185,129,0.8)"
    }}
    whileTap={{
      scale: 0.9,
      rotate: -5
    }}
    title="Habla con nuestro asistente agrícola"
  >
    <Bot className="h-7 w-7" />
  </motion.button>
</motion.div>



      
    </div>
  );
}

export default App;