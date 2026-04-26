import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackEvent } from '../utils/analytics';

const ScrollToTop = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    trackEvent('page_view', { path: `${pathname}${search}` });
  }, [pathname, search]);

  return null;
};

export default ScrollToTop;
