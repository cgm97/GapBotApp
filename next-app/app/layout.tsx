
import Header from '@/components/Header';
import Top from '@/components/Top';
import Footer from '@/components/Footer';
import KakaoAdFit from '@/components/KakaoAdFit';
import { UserProvider } from '@/context/UserContext';  // 경로 확인
import Script from 'next/script';

export const viewport = {
  width: "device-width",
  initialScale: 0.5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
        {/* Google Analytics */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-KMGNSECTNH"
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-KMGNSECTNH');
            `,
          }}
        />
        {/* 네이버 WCS 스크립트 삽입 */}
        <Script src="//wcs.naver.net/wcslog.js" strategy="beforeInteractive"></Script>
        <Script strategy="lazyOnload">
          {`
            if(!wcs_add) var wcs_add = {};
            wcs_add["wa"] = "1200ae6f7282070";
            if(window.wcs) {
            wcs_do();
          }`}
        </Script>
        {/* Google AdSense */}
        <Script
          async
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3394263366814430"
          crossOrigin="anonymous"
        />
      </head>
      <body className="dark:bg-background">
        <div className="bg-background text-foreground min-h-screen">
        <UserProvider>
          <div className="wrapper">
            <div className="advertise left">
              {/* <KakaoAdFit unit="DAN-Qnq0ez9rvfuNOCVh" width={160} height={600} disabled={true} /> */}
            </div>

            <div className="content dark:bg-background">
              <Top />
              <Header />
              {children} {/* 페이지 컴포넌트들이 여기에 렌더링됨 */}
              <Footer /> 
            </div>

            <div className="advertise right">
              {/* <KakaoAdFit unit="DAN-sj5267WiC2Xirn0q" width={160} height={600} disabled={true} /> */}
            </div>
          </div>
        </UserProvider>
        </div>
      </body>
    </html>
  );
}