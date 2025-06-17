import { useEffect, useRef } from 'react';

export default function AdSense({ adSlot, style = {}, format = 'auto' }) {
  const adRef = useRef(null);

  useEffect(() => {
    if (!adRef.current) return;

    try {
      // 광고가 이미 렌더링된 경우 중복 push 방지
      if (adRef.current.getAttribute('data-adsbygoogle-status') !== 'done') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      console.error('Adsense error:', e);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      ref={adRef}
      style={{ display: 'block', ...style }}
      data-ad-client="ca-pub-3394263366814430"
      data-ad-slot={adSlot}
      data-ad-format={format}
      data-full-width-responsive="true"
    ></ins>
  );
}