import React from 'react';
import { X, Star } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface SparePart {
  id: number;
  name: string;
  description: string;
  image_url: string;
  price: string;
  specifications: { label: string; value: string }[];
  features: string[];
}

interface SparePartModalProps {
  sparePart: SparePart;
  onClose: () => void;
}

const SparePartModal: React.FC<SparePartModalProps> = ({ sparePart, onClose }) => {
  const { t } = useTranslation();
  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(t('sparePartModal.whatsappMessage', { partName: sparePart.name }));
    window.open(`https://wa.me/51958840599?text=${message}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-xl w-full max-w-sm max-h-[85vh] overflow-hidden shadow-lg"
        initial={{ opacity: 0, y: 10, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.97 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        <div className="bg-gray-50 flex items-center justify-center p-6">
          <img
            src={sparePart.image_url || 'https://via.placeholder.com/300x300/f3f4f6/6b7280?text=Repuesto'}
            alt={sparePart.name}
            className="max-h-40 w-auto object-contain"
            onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/300x300/f3f4f6/6b7280?text=Repuesto')}
          />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-1">
          <div className="flex items-center gap-2 min-w-0">
            <h2 className="text-sm font-semibold text-gray-900 leading-snug truncate">{sparePart.name}</h2>
            <span className="bg-machinery-200 text-tractor-700 px-1.5 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-0.5 shadow-sm flex-shrink-0">
              <Star className="h-2.5 w-2.5 fill-current" />
              {t('sparePartModal.quality')}
            </span>
          </div>
          <motion.button
            onClick={onClose}
            className="text-gray-300 hover:text-gray-500 transition-colors flex-shrink-0"
            whileTap={{ scale: 0.9 }}
          >
            <X className="h-4 w-4" />
          </motion.button>
        </div>

        {/* Content */}
        <div className="px-4 pb-3 overflow-y-auto max-h-[calc(85vh-260px)] space-y-3">
          {sparePart.description && (
            <p className="text-xs text-gray-600 leading-relaxed">{sparePart.description}</p>
          )}

          {sparePart.specifications && sparePart.specifications.length > 0 && (
            <div>
              <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">{t('sparePartModal.specifications')}</h3>
              <div className="space-y-1">
                {sparePart.specifications.map((spec, index) => (
                  <div key={index} className="flex justify-between py-1 border-b border-gray-50 last:border-0">
                    <span className="text-[11px] text-gray-500">{spec.label}</span>
                    <span className="text-[11px] font-medium text-gray-800">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {sparePart.features && sparePart.features.length > 0 && (
            <div>
              <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">{t('sparePartModal.features')}</h3>
              <ul className="space-y-1">
                {sparePart.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-1.5 text-[11px] text-gray-700">
                    <span className="text-gray-300 mt-0.5">—</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-end gap-2">
          <motion.button
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors"
            whileTap={{ scale: 0.97 }}
          >
            {t('sparePartModal.close')}
          </motion.button>
          <motion.button
            onClick={handleWhatsAppClick}
            className="px-3 py-1.5 text-xs font-medium text-white bg-green-500 hover:bg-green-600 rounded-lg transition-colors inline-flex items-center gap-1.5"
            whileTap={{ scale: 0.97 }}
          >
            <FaWhatsapp className="h-3.5 w-3.5" />
            {t('sparePartModal.quote')}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SparePartModal;