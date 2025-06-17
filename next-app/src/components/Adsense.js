'use client';

import { useEffect } from 'react';

export default function AdSense({ adSlot }) {

  useEffect(() => {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block'}}
      data-ad-client="ca-pub-3394263366814430"
      data-ad-slot={adSlot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  );
}
