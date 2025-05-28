export const metadata = {
  title: '패치노트 | LOAGAP',
  description: '빈틈봇 패치노트 목록',
  keywords: 'LOAGAP, 빈틈봇, 후원, 로스트아크, 로아봇, 군장봇, 군검봇, 유각, 보석, 겁화, 멸화, 작열 ,홍염 유물, 유각시세, 시세, 차트, 유각 차트',
  openGraph: {
    title: '패치노트 | LOAGAP',
    description: '빈틈봇 패치노트 목록',
    url: 'https://loagap.com/patchnote',
    type: 'website',
    images: [
        {
          url: 'https://loagap.com/img/logo.png',
          alt: `빈틈 이미지`
        }
      ]
  },
};

import PatchNotePage from './patchnoteClient';

export default function Page() {
  return <PatchNotePage />;
}
