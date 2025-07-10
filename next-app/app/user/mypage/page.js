import ProtectedRoute from '@/context/ProtectedRoute';
import MyPage from './myPageClient';

export const metadata = {
  title: '내정보 | LOAGAP',
  description: 'LOAGAP - Mypage(내정보), 빈틈봇과 연동하거나, 대표 캐릭터를 저장하여 원정대를 등록할 수 있습니다.',
  keywords: 'LOAGAP, 빈틈봇, 로스트아크, 대표캐릭터, 원정대',
  openGraph: {
    title: '내정보 | LOAGAP',
    description: 'LOAGAP - Mypage(내정보), 빈틈봇과 연동하거나, 대표 캐릭터를 저장하여 원정대를 등록할 수 있습니다.',
    url: 'https://loagap.com/user/mypage',
    type: 'website',
    images: [
        {
          url: '/https://loagap.com/img/logo.png',
          alt: `빈틈 이미지`
        }
      ]
  },
};

export default async function Page() {

  return <ProtectedRoute> <MyPage/> </ProtectedRoute>;
}