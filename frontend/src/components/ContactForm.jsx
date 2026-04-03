import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

const ContactForm = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle, sending, success, error
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao enviar a mensagem.');
      }

      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000); // Mensagem de sucesso some dps de 5s
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setStatus('error');
      setErrorMessage(error.message);
    }
  };

  return (
    <motion.section 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="w-full py-20 px-4 md:px-8 flex items-center justify-center bg-transparent"
    >
      <div className="w-full max-w-3xl backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/5 rounded-2xl shadow-xl p-8 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-brand-500/20 dark:bg-brand-600/30 rounded-full mix-blend-multiply filter blur-2xl animate-pulse" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-brand-300/20 dark:bg-brand-400/30 rounded-full mix-blend-multiply filter blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-brand-900 dark:text-white mb-2 text-center">{t('contact_title')}</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8 text-center text-sm md:text-base">{t('contact_desc')}</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label flex htmlFor="name" className="block text-sm font-medium text-brand-700 dark:text-gray-300 mb-1">{t('contact_name')}</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-black/30 border border-gray-300/50 dark:border-brand-700/50 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-brand-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400/80 backdrop-blur-sm shadow-sm"
                  placeholder={t('contact_name_ph')}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-brand-700 dark:text-gray-300 mb-1">{t('contact_email')}</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-black/30 border border-gray-300/50 dark:border-brand-700/50 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-brand-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400/80 backdrop-blur-sm shadow-sm"
                  placeholder={t('contact_email_ph')}
                />
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-brand-700 dark:text-gray-300 mb-1">{t('contact_msg')}</label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-black/30 border border-gray-300/50 dark:border-brand-700/50 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-brand-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400/80 resize-none backdrop-blur-sm shadow-sm"
                placeholder={t('contact_msg_ph')}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              disabled={status === 'sending'}
              type="submit"
              className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white font-medium shadow-lg shadow-brand-500/20 transition-all flex items-center justify-center disabled:opacity-75 disabled:cursor-not-allowed group"
            >
              {status === 'sending' ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{t('contact_btn_sending')}</span>
                </div>
              ) : (
                <span className="flex items-center gap-2">
                  {t('contact_btn_send')}
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </span>
              )}
            </motion.button>

            {status === 'success' && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400 text-center font-medium shadow-sm backdrop-blur-md"
              >
                {t('contact_success')}
              </motion.div>
            )}

            {status === 'error' && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-400 text-center font-medium shadow-sm backdrop-blur-md"
              >
                {errorMessage}
              </motion.div>
            )}
          </form>
        </div>
      </div>
    </motion.section>
  );
};

export default ContactForm;
