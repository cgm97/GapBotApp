import BookPage from './bookClient';
import AdSense from '@/components/Adsense';

async function getBooksPriceData() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/price/book`, {
    next: { revalidate: 60 }, // ISR or SSR
  });
  if (!res.ok) throw new Error("Failed to fetch");
  const data = await res.json();
  return data;
}

export const metadata = {
  title: '유각시세 · 유각차트 | LOAGAP',
  description: '로스트아크의 실시간 유물 각인서 시세, 차트, 가격 변동, 랭킹 정보를 빠르게 확인해보세요.',
  keywords: 'LOAGAP, 빈틈봇, 로아 ,실시간, 유각, 유각 시세, 유각 차트, 유각가격, 유각랭킹, 유각순위, 유물, 유물 각인서, 각인서, 아드, 원한, 로스트아크, 실시간 로아 시세',
  openGraph: {
    title: '유각시세 · 유각차트 | LOAGAP',
    description: '로스트아크의 실시간 유물 각인서 시세, 차트, 가격 변동, 랭킹 정보를 빠르게 확인해보세요.',
    url: 'https://loagap.com/price/book',
    type: 'website',
    images: [
        {
          url: 'https://loagap.com/img/logo.png',
          alt: `빈틈 이미지`
        }
      ]
  },
};

export default async function Page() {
  const { booksPrice, bookPriceLastUpdate } = await getBooksPriceData();

  return (
    <div className="container-patch">
      <h2>유각시세 / 유각차트</h2>
      <div>
        <AdSense adSlot="1488834693" />
      </div>
      <BookPage booksPrice={booksPrice} bookLastUpdate={bookPriceLastUpdate} />
    </div>
  );
}