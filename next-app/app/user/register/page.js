import RegisterPage from './RegisterClient';

export const metadata = {
  title: '회원가입 | LOAGAP',
  description: 'LOAGAP 빈틈봇 - 회원가입',
  keywords: 'LOAGAP, 빈틈봇, 회원가입',
  openGraph: {
    title: '회원가입 | LOAGAP',
    description: 'LOAGAP, 빈틈봇, 회원가입',
    url: 'https://loagap.com/register',
    type: 'website',
    images: [
        {
          url: '/img/logo.png',
          alt: `빈틈 이미지`
        }
      ]
  },
};

export default async function Page() {

  return <RegisterPage />;
}