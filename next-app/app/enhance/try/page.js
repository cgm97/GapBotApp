export const metadata = {
  title: '재련 | LOAGAP',
  description: '빈틈봇 재련 게임을 시작해보세요!',
  keywords: 'LOAGAP, 빈틈봇, 후원, 로스트아크, 로아봇, 군장봇, 군검봇, 유각, 보석, 겁화, 멸화, 작열 ,홍염 유물, 유각시세, 시세, 차트, 유각 차트',
  openGraph: {
    title: '재련 | LOAGAP',
    description: '빈틈봇 재련 게임을 시작해보세요!',
    url: 'https://loagap.com/enhance/try',
    type: 'website',
    images: [
      {
        url: 'https://loagap.com/img/logo.png',
        alt: `빈틈 이미지`
      }
    ]
  },
};

import TryClient from './tryClient';
import AdvanceTryClient from './advanceTryClient';

export default async function Page() {
  return (
    <div className="flex flex-wrap gap-6 justify-center p-6 dark:bg-gray-900 min-h-screen">
      <div className="w-full lg:flex-1 lg:min-w-[320px] lg:max-w-md">
        <TryClient />
      </div>
      <div className="w-full lg:flex-1 lg:min-w-[320px] lg:max-w-md">
        <AdvanceTryClient />
      </div>
    </div>
  );
}