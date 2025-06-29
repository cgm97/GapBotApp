// components/Footer.tsx
export default function Footer() {
    return (
        <footer className="py-4 text-center text-sm text-gray-600 dark:text-gray-400">
            <div className="space-x-2">
                <a
                    href="/privacy-policy"
                    rel="noopener noreferrer"
                    className="text-black dark:text-gray-300 hover:underline hover:text-blue-600 dark:hover:text-blue-400 transition"
                >
                    개인정보처리방침
                </a>
                <span>|</span>
                <a
                    href="/terms"
                    rel="noopener noreferrer"
                    className="text-black dark:text-gray-300 hover:underline hover:text-blue-600 dark:hover:text-blue-400 transition"
                >
                    이용약관
                </a>
                <span>|</span>
                <a
                    href="https://open.kakao.com/o/svYJKm1g"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-black dark:text-gray-300 hover:underline hover:text-blue-600 dark:hover:text-blue-400 transition"
                >
                    문의하기
                </a>
            </div>
            <div className="mt-2">
                ⓒ {new Date().getFullYear()} LOAGAP. All rights reserved.
            </div>
        </footer>

    );
}