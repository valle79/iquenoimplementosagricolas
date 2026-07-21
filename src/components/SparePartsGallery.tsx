import React, { useState, useEffect } from 'react';
import { Eye, Search, Package, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import SparePartModal from './SparePartModal';
import { supabase } from '../../lib/supabaseClient';
import type { SparePart } from '../types';
import { parseJsonField } from '../utils/parse';

interface SparePartsGalleryProps {
  searchQuery?: string;
}

const SparePartsGallery: React.FC<SparePartsGalleryProps> = () => {
  const { t } = useTranslation();
  const [spareParts, setSpareParts] = useState<SparePart[]>([]);
  const [selectedSparePart, setSelectedSparePart] = useState<SparePart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchSpareParts = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data, error } = await supabase
          .from('spare_parts')
          .select('id, name, description, image_url, price, specifications, features')
          .order('id', { ascending: false });

        if (error) throw new Error(`Error al cargar repuestos: ${error.message}`);

        const parsed = (data ?? []).map((item) => ({
          ...item,
          specifications: parseJsonField(item.specifications, []),
          features: parseJsonField(item.features, []),
        }));
        setSpareParts(parsed);
      } catch (err) {
        console.error('Error al cargar repuestos:', err);
        setError(t('spareParts.error'));
      } finally {
        setLoading(false);
      }
    };
    fetchSpareParts();
  }, []);

  const filteredSpareParts = searchTerm.trim() === ''
    ? spareParts
    : spareParts.filter(sparePart =>
        sparePart.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sparePart.description.toLowerCase().includes(searchTerm.toLowerCase())
      );

  const handleViewDetails = (sparePart: SparePart) => {
    setSelectedSparePart(sparePart);
  };

  const handleWhatsAppClick = (sparePartName: string) => {
    const message = encodeURIComponent(t('sparePartModal.whatsappMessage', { partName: sparePartName }));
    window.open(`https://wa.me/51958840599?text=${message}`, '_blank', 'noopener,noreferrer');
  };

  // Variantes de animación mejoradas
  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { 
        delay: index * 0.08, 
        duration: 0.6, 
        ease: [0.43, 0.13, 0.23, 0.96] 
      },
    }),
    hover: {
      scale: 1.03,
      y: -8,
      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-tractor-200 border-t-machinery-200 mb-4"></div>
        <p className="text-tractor-600 text-lg font-medium">{t('spareParts.loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <Package className="h-16 w-16 text-red-400 mx-auto mb-4" />
        <p className="text-red-500 text-lg font-medium">{error}</p>
      </div>
    );
  }

  return (
    <>
      {/* Barra de búsqueda */}
      <motion.div 
        className="mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="relative w-full max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('spareParts.searchPlaceholder')}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-tractor-200/20 focus:border-tractor-200 transition-all duration-300 placeholder-gray-400"
          />
        </div>
      </motion.div>

      {/* Grid de repuestos */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {filteredSpareParts.length > 0 ? (
          filteredSpareParts.map((sparePart, index) => (
            <motion.div
              key={sparePart.id}
              className="group bg-white rounded-xl border border-gray-200/60 hover:border-tractor-200/40 transition-all duration-300"
              custom={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              whileHover="hover"
              viewport={{ once: true }}
            >
              <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-50">
                <div className="absolute top-2 left-2 z-10 bg-machinery-200 text-tractor-700 px-2 py-0.5 rounded-full text-[10px] font-bold shadow-md flex items-center gap-1">
                  <Star className="h-3 w-3 fill-current" />
                  {t('spareParts.quality')}
                </div>
                <img
                  src={sparePart.image_url || 'https://via.placeholder.com/400x300/f3f4f6/6b7280?text=Repuesto'}
                  alt={sparePart.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/400x300/f3f4f6/6b7280?text=Repuesto')}
                />
              </div>

              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-800 mb-2 line-clamp-1">
                  {sparePart.name}
                </h3>
                {(() => {
                    const materialSpec = sparePart.specifications?.find(s => s.label === 'Material');
                    return materialSpec ? (
                      <div className="flex items-center gap-1.5 mb-3">
                        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{t('spareParts.material')}:</span>
                        <span className="text-xs font-medium text-tractor-600 bg-tractor-50 px-2 py-0.5 rounded-md">{materialSpec.value}</span>
                      </div>
                    ) : null;
                  })()}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewDetails(sparePart)}
                    className="flex-1 bg-gray-50 text-gray-600 px-3 py-2 rounded-lg text-xs font-medium hover:bg-gray-100 transition-colors inline-flex items-center justify-center gap-1.5"
                  >
                    <Eye className="h-3.5 w-3.5" /> {t('spareParts.details')}
                  </button>
                  <button
                    onClick={() => handleWhatsAppClick(sparePart.name)}
                    className="flex-1 bg-green-500 text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-green-600 transition-colors inline-flex items-center justify-center gap-1.5"
                  >
                    <FaWhatsapp className="h-3.5 w-3.5" /> {t('spareParts.quote')}
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <motion.div 
            className="col-span-full text-center py-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Package className="h-16 w-16 text-tractor-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-tractor-600 mb-2">{t('spareParts.noResults')}</h3>
            <p className="text-tractor-500">{t('spareParts.noResultsHint')}</p>
          </motion.div>
        )}
      </motion.div>

      {selectedSparePart && (
        <SparePartModal
          sparePart={selectedSparePart}
          onClose={() => setSelectedSparePart(null)}
        />
      )}
    </>
  );
};

export default SparePartsGallery;