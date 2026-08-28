import React, { useState, useEffect } from 'react';
import { Eye, Search, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import ProductModal from './ProductModal';
import { fetchProducts } from '../lib/api';
import { MachineProduct } from '../types';
import { parseJsonField } from '../utils/parse';

interface MachineGalleryProps {
  searchQuery?: string;
}

const MachineGallery: React.FC<MachineGalleryProps> = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState<MachineProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<MachineProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchProducts();
        const parsed = (data ?? []).map((item) => ({
          ...item,
          specifications: parseJsonField(item.specifications, []),
          features: parseJsonField(item.features, []),
          dimensions: parseJsonField(item.dimensions, { width: 0, height: 0, depth: 0, weight: 0 }),
        }));
        // Mantener el mismo orden que producía Supabase (id descendente)
        parsed.sort((a, b) => b.id - a.id);
        setProducts(parsed);
      } catch (err) {
        console.error('Error al cargar productos:', err);
        setError(t('products.error'));
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  // Filtrar productos con coincidencias parciales o mostrar todos si searchTerm está vacío
  const filteredProducts = searchTerm.trim() === ''
    ? products
    : products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

  const handleWhatsAppClick = (productName: string) => {
    const message = encodeURIComponent(t('machineGallery.whatsappMessage', { productName }));
    window.open(`https://wa.me/51958840599?text=${message}`, '_blank', 'noopener,noreferrer');
  };

  const handleViewDetails = (product: MachineProduct) => {
    setSelectedProduct(product);
  };

  if (loading) {
    return <div className="text-center py-10">{t('products.loading')}</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
      {/* Barra de búsqueda mejorada */}
      <motion.div 
        className="mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="relative w-full max-w-2xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-tractor-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('products.searchPlaceholder')}
            className="w-full pl-12 pr-4 py-4 text-tractor-700 bg-white border-2 border-tractor-200 rounded-2xl shadow-lg focus:outline-none focus:ring-4 focus:ring-tractor-200/50 focus:border-tractor-400 transition-all duration-300 placeholder-tractor-400 text-base font-medium"
          />
          <div className="absolute inset-y-0 right-0 pr-4 items-center hidden lg:flex">
            <div className="bg-tractor-100 text-tractor-600 px-3 py-1 rounded-lg text-sm font-medium">
              {filteredProducts.length} {t('products.productCount')}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div 
              key={product.id} 
              className="w-full bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
            >
              <div className="relative h-[300px] p-4 flex items-center justify-center bg-gray-50">
                <div className="absolute top-2 left-2 z-10 bg-machinery-200 text-tractor-700 px-2 py-0.5 rounded-full text-[10px] font-bold shadow-md flex items-center gap-1">
                  <Star className="h-3 w-3 fill-current" />
                  {t('products.quality')}
                </div>
                <img 
                  src={product.image_url || 'https://via.placeholder.com/300'} 
                  alt={product.name}
                  loading="lazy"
                  className="w-full h-full object-cover absolute inset-0"
                  onError={(e) => {
                    console.error('Error loading image for:', product.name);
                    e.currentTarget.src = 'https://via.placeholder.com/300';
                  }}
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                  <button 
                    onClick={() => handleViewDetails(product)}
                    className="bg-white/90 backdrop-blur-sm text-tractor-400 px-6 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-white transition-all duration-300 group"
                  >
                    <Eye className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">{t('products.viewDetails')}</span>
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-2 truncate">
                  {product.name || t('products.noName')}
                </h3>
                <div className="bg-tractor-50 text-tractor-600 text-sm px-3 py-1 rounded-full inline-block mb-3">
                  {product.specifications[0]?.value || t('products.noSpecs')}
                </div>
                <div className="flex items-center justify-between gap-3">
                  <button 
                    onClick={() => handleWhatsAppClick(product.name)}
                    className="flex-1 bg-green-500 text-white px-4 py-2.5 rounded-lg 
                             hover:bg-green-600 active:scale-95 
                             transition-all duration-300 transform
                             flex items-center justify-center gap-2
                             shadow-md hover:shadow-xl
                             group"
                  >
                    <FaWhatsapp className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                    <span className="font-medium group-hover:translate-x-1 transition-transform">
                      {t('products.quote')}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-tractor-700 col-span-full">{t('products.noResults')}</p>
        )}
      </div>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => {
            setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
};

export default MachineGallery;
