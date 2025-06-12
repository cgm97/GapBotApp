// components/Footer.tsx
export default function Footer() {
    return (
        <footer style={{ padding: '1rem', textAlign: 'center', fontSize: '0.85rem', color: '#666' }}>
            <div>
                <a href="/privacy-policy" rel="noopener noreferrer" className="text-black hover:underline hover:text-blue-600 transition">
                    개인정보처리방침
                </a> |{' '}
                <a href="/terms" rel="noopener noreferrer" className="text-black hover:underline hover:text-blue-600 transition">
                    이용약관
                </a> |{' '}
                <a href="https://open.kakao.com/o/svYJKm1g" target="_blank" rel="noopener noreferrer" className="text-black hover:underline hover:text-blue-600 transition">
                    문의하기
                </a>

            </div>
            <div style={{ marginTop: '0.5rem' }}>
                ⓒ {new Date().getFullYear()} LOAGAP. All rights reserved.
            </div>
        </footer>
    );
}