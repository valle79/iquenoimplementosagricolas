import React, { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { useTranslation } from 'react-i18next';

interface ContactFormProps {
  onSuccess: () => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ onSuccess }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    emailjs.init("SAR5bihfrW9xpbm4o");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        phone: formData.phone,
        message: formData.message,
        to_email: 'eliquenosac.lili@gmail.com'
      };

      await emailjs.send(
        'service_l03q9on',
        'template_njam9ds',
        templateParams
      );

      // Limpiar el formulario y mostrar mensaje de éxito
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
      
      onSuccess();
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
      alert('Hubo un error al enviar el mensaje. Por favor, intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-lg">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          {t('contact.formName')}
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tractor-200 focus:border-transparent"
          placeholder={t('contact.formNamePlaceholder')}
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          {t('contact.formEmail')}
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tractor-200 focus:border-transparent"
          placeholder={t('contact.formEmailPlaceholder')}
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          {t('contact.formPhone')}
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          required
          value={formData.phone}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tractor-200 focus:border-transparent"
          placeholder={t('contact.formPhonePlaceholder')}
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          {t('contact.formMessage')}
        </label>
        <textarea
          id="message"
          name="message"
          required
          value={formData.message}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tractor-200 focus:border-transparent resize-none"
          placeholder={t('contact.formMessagePlaceholder')}
          disabled={isSubmitting}
        />
      </div>

      <button
        type="submit"
        className={`w-full bg-tractor-200 text-white py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center ${
          isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-tractor-300'
        }`}
        disabled={isSubmitting}
      >
        <Send className="h-5 w-5 mr-2" />
        {isSubmitting ? t('contact.formSubmitting') : t('contact.formSubmit')}
      </button>
    </form>
  );
};

export default ContactForm;