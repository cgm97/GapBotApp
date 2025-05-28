
import CubePage from './cubeClient';
import {character, cube} from './data/cubeTempJson';

export const metadata = {
  title: '큐브 계산기 | LOAGAP',
  description: '로스트아크 큐브 계산기입니다. 빈틈봇과 연동 할 수 있으며, 모든 원정대 큐브목록 수익을 계산합니다.',
  keywords: 'LOAGAP, 빈틈봇, 큐브 계산기, 금제, 해금, 큐브게산, 큐브목록, 에브니 큐브, 큐브, 에브니',
  openGraph: {
    title: '큐브 계산기 | LOAGAP',
    description: '로스트아크 큐브 계산기입니다. 빈틈봇과 연동 할 수 있으며, 모든 원정대 큐브목록 수익을 계산합니다.',
    url: 'https://loagap.com/cube',
    type: 'website',
    images: [
        {
          url: '/img/logo.png',
          alt: `빈틈 이미지`
        }
      ]
  },
};

export default function Page() {
  return <CubePage characterTemp={character} cubeTemp={cube} />;
}
