'use client';

import { useEffect } from 'react';

export default function AdSense({ adSlot }) {

  useEffect(() => {
        try {
          window.adsbygoogle = window.adsbygoogle || [];
          window.adsbygoogle.push({});
        }
        catch(e){
        }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block',
               width: '100%'
            }}
      data-ad-client="ca-pub-3394263366814430"
      data-ad-slot={adSlot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  );
}
