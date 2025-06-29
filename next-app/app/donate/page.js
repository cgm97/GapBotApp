export const metadata = {
  title: '후원안내 | LOAGAP',
  description: '빈틈봇에 후원을 해주세요! 서버비용 및 유지보수에 많은 도움이 됩니다.',
  keywords: 'LOAGAP, 빈틈봇, 후원, 로스트아크, 로아봇, 군장봇, 군검봇, 유각, 보석, 겁화, 멸화, 작열 ,홍염 유물, 유각시세, 시세, 차트, 유각차트',
  openGraph: {
    title: 'LOAGAP 빈틈봇 후원안내',
    description: '빈틈봇에 후원을 해주세요! 서버비용 및 유지보수에 많은 도움이 됩니다.',
    url: 'https://loagap.com/donate',
    type: 'website',
    images: [
        {
          url: 'https://loagap.com/img/logo.png',
          alt: `빈틈 이미지`
        }
      ]
  },
};

import DonatePage from './donateClient';

export default function Page() {
  return <DonatePage />;
}
