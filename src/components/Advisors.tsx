import React, { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../lib/supabaseClient';
import ImageSwiper from './ImageSwiper';

interface Advisor {
  id: number;
  name: string;
  position: string;
  image_url: string;
  whatsapp: string;
  specialties: string[];
}

const Advisors: React.FC = () => {
  const { t } = useTranslation();
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchAdvisors = async () => {
      const { data, error } = await supabase
        .from('advisors')
        .select('id, name, image_url, whatsapp, specialties, position')
        .eq('deleted', false)
        .order('id', { ascending: true });

      if (data && !error) {
        const advisorsWithUrls = data.map(advisor => {
          let specialties = Array.isArray(advisor.specialties) ? advisor.specialties : [];
          if (typeof advisor.specialties === 'string') {
            try {
              specialties = JSON.parse(advisor.specialties);
              if (!Array.isArray(specialties)) specialties = [];
            } catch (e) {
              console.error('Error parsing specialties:', e);
              specialties = [];
            }
          }
          return {
            ...advisor,
            image_url: advisor.image_url || 'https://via.placeholder.com/350',
            specialties,
          };
        });
        setAdvisors(advisorsWithUrls);
      } else if (error) {
        console.error('Error fetching advisors:', error);
      }
    };
    fetchAdvisors();
  }, []);

  const handleWhatsAppClick = (phone: string) => {
    window.open(`https://wa.me/51${phone}`, '_blank', 'noopener,noreferrer');
  };

  const activeAdvisor = advisors[activeIndex];
  const imagesCsv = advisors.map(a => a.image_url).join(',');

  if (advisors.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400 text-sm">
        {t('advisors.unavailable')}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">
        <div className="flex-shrink-0">
          <ImageSwiper
            images={imagesCsv}
            cardWidth={240}
            cardHeight={320}
            onActiveChange={setActiveIndex}
          />
        </div>

        <div className="flex-1 w-full lg:w-auto text-center lg:text-left pt-4 lg:pt-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-1">{activeAdvisor?.name}</h3>
          <p className="text-sm text-gray-400 mb-5">{activeAdvisor?.position || 'Asesor'}</p>

          {activeAdvisor?.specialties && activeAdvisor.specialties.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-6">
              {activeAdvisor.specialties.map((specialty, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-full font-medium"
                >
                  {specialty}
                </span>
              ))}
            </div>
          )}

          <button
            onClick={() => activeAdvisor && handleWhatsAppClick(activeAdvisor.whatsapp)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors shadow-sm"
          >
            <MessageCircle className="h-4 w-4" />
            {t('advisors.contactWhatsApp')}
          </button>

          {advisors.length > 1 && (
            <div className="flex gap-1.5 justify-center lg:justify-start mt-8">
              {advisors.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === activeIndex
                      ? 'w-6 h-1.5 bg-gray-800'
                      : 'w-1.5 h-1.5 bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Advisors;
