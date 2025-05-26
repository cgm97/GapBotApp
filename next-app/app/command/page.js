export const metadata = {
  title: '명령어 | LOAGAP',
  description: '빈틈봇 명령어 목록을 확인할 수 있습니다.',
  keywords: 'LOAGAP, 빈틈봇, 명령어, 로아봇, 군장봇, 군검봇, 카톡봇, 유각, 보석, 겁화, 멸화, 작열 ,홍염 유물, 유각시세, 시세, 차트, 유각차트, 로스트아크',
  openGraph: {
    title: '명령어 | LOAGAP',
    description: '빈틈봇 명령어 목록을 확인할 수 있습니다.',
    url: 'https://loagap.com/command',
    type: 'website',
  },
};

import CommandPage from './commandClient';

export default function Page() {
  return <CommandPage />;
}
