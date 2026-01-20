export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const ensureHttps = (url: string): string => {
  if (!url) return '';
  
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  return `https://${url}`;
};

export const extractDomain = (url: string): string => {
  try {
    const urlObj = new URL(ensureHttps(url));
    return urlObj.hostname;
  } catch {
    return '';
  }
};