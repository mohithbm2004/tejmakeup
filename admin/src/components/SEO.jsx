import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useSettings } from '../context/SettingsContext';

const SEO = ({ title, description, image, url }) => {
  const { settings } = useSettings();

  const siteTitle = title ? `${title} | ${settings.businessName}` : settings.seoTitle || settings.businessName;
  const siteDesc = description || settings.seoDescription;
  const siteImg = image || settings.heroImage;

  return (
    <Helmet>
      <title>{siteTitle}</title>
      <meta name="description" content={siteDesc} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={siteDesc} />
      {siteImg && <meta property="og:image" content={siteImg} />}
      {url && <meta property="og:url" content={url} />}
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
  );
};

export default SEO;
