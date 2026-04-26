type EventPayload = Record<string, string | number | boolean | null | undefined>;

export const trackEvent = (event: string, payload: EventPayload = {}): void => {
  if ((window as any).gtag) {
    (window as any).gtag('event', event, payload);
    return;
  }
  if ((window as any).dataLayer) {
    (window as any).dataLayer.push({ event, ...payload });
    return;
  }
  if (import.meta.env.DEV) {
    console.info('[analytics]', event, payload);
  }
};
