import React from 'react';
import { X, Download, Check, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { MachineProduct } from '../types';

interface ProductModalProps {
  product: MachineProduct;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const { t } = useTranslation();
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleDownloadFicha = () => {
    if (product.pdf_url) {
      window.open(product.pdf_url, '_blank', 'noopener,noreferrer');
    } else {
      alert(t('productModal.noSheet'));
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-2 transition-colors z-10"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-bold text-gray-800">{product.name || 'Producto'}</h2>
            <span className="bg-machinery-200 text-tractor-700 px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm flex-shrink-0">
              <Star className="h-3.5 w-3.5 fill-current" />
              {t('productModal.quality')}
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="relative group">
                <img
                  src={product.image_url || 'https://via.placeholder.com/300'}
                  alt={product.name}
                  className="w-full h-[400px] rounded-lg object-cover shadow-lg transition-transform duration-300 group-hover:scale-[1.02]"
                  onError={(e) => {
                    console.error('Error loading image for:', product.name);
                    e.currentTarget.src = 'https://via.placeholder.com/300';
                  }}
                />
                <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              {product.pdf_url && (
                <button
                  onClick={handleDownloadFicha}
                  className="w-full bg-green-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-green-700 transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-xl"
                >
                  <Download className="h-5 w-5" />
                  <span>{t('productModal.downloadSheet')}</span>
                </button>
              )}
            </div>

            <div className="space-y-6">
              {product.description && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">{t('productModal.description')}</h3>
                  <p className="text-gray-600">{product.description}</p>
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold mb-2">{t('productModal.features')}</h3>
                {product.features && product.features.length > 0 ? (
                  <ul className="space-y-2">
                    {product.features.map((feature: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">{t('productModal.noFeatures')}</p>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">{t('productModal.specifications')}</h3>
                {product.specifications && product.specifications.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4">
                    {product.specifications.map((spec, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-sm text-gray-600">{spec.label}</div>
                        <div className="font-medium">{spec.value}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">{t('productModal.noSpecs')}</p>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">{t('productModal.dimensions')}</h3>
                {product.dimensions && Object.keys(product.dimensions).length > 0 ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-600">{t('productModal.dimensionsFormat')}</div>
                      <div className="font-medium">
                        {product.dimensions.width || 0}cm x {product.dimensions.height || 0}cm x {product.dimensions.depth || 0}cm
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-600">{t('productModal.weight')}</div>
                      <div className="font-medium">{product.dimensions.weight || 0} kg</div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">{t('productModal.noDimensions')}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
