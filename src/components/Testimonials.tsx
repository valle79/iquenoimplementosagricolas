import React from 'react';
import { useTranslation } from 'react-i18next';
import imagelorena from '../assets/lorena.png';
import imagemaicol from '../assets/maicol.png';
import imagemanzo from '../assets/richiboy.jpg';

const testimonialMeta = [
  { id: 1, image: imagemaicol, key: 'testimonialData.testimonial1' },
  { id: 2, image: imagelorena, key: 'testimonialData.testimonial2' },
  { id: 3, image: imagemanzo, key: 'testimonialData.testimonial3' },
];

const Testimonials: React.FC = () => {
  const { t } = useTranslation();
  const testimonials = testimonialMeta.map(tm => ({
    ...tm,
    name: t(`${tm.key}.name`),
    company: t(`${tm.key}.company`),
    content: t(`${tm.key}.content`),
  }));

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {testimonials.map(testimonial => (
        <div key={testimonial.id} className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-4">
            <img
              src={testimonial.image}
              alt={testimonial.name}
              className="w-12 h-12 rounded-full object-cover mr-4"
            />
            <div>
              <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
              <p className="text-gray-600 text-sm">{testimonial.company}</p>
            </div>
          </div>
          <p className="text-gray-700 italic">"{testimonial.content}"</p>
        </div>
      ))}
    </div>
  );
};

export default Testimonials;