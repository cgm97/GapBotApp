import LoginPage from './loginClient';

export const metadata = {
  title: '로그인 | LOAGAP',
  description: 'LOAGAP - 빈틈봇 로그인',
  keywords: 'LOAGAP, 빈틈봇',
  openGraph: {
    title: '로그인 | LOAGAP',
    description: 'LOAGAP - 빈틈봇 로그인',
    url: 'https://loagap.com/user/login',
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
  return <LoginPage/>;
}