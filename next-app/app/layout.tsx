
import Header from '@/components/Header';
import Top from '@/components/Top';
import KakaoAdFit from '@/components/KakaoAdFit';
import { UserProvider } from '@/context/UserContext';  // 경로 확인

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head><link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
  /></head>
      <body>
        <UserProvider>
        <div className="wrapper">
          <div className="advertise left">
            <KakaoAdFit unit="DAN-Qnq0ez9rvfuNOCVh" width={160} height={600} disabled={true} />
          </div>

          <div className="content">
            <Top />
            <Header />
            {children} {/* 페이지 컴포넌트들이 여기에 렌더링됨 */}
          </div>

          <div className="advertise right">
            <KakaoAdFit unit="DAN-sj5267WiC2Xirn0q" width={160} height={600} disabled={true} />
          </div>
        </div>
         </UserProvider>
      </body>
    </html>
  );
}