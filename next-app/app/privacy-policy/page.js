export const metadata = {
  title: '개인정보처리방침 | LOAGAP',
  description: 'LOAGAP의 개인정보 처리 방침을 안내합니다. 사용자 데이터 수집, 이용 목적, 보관 기간 등을 확인하세요.',
  robots: 'index, follow',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 text-sm text-gray-800 leading-6 dark:text-gray-200">
      <h1 className="text-2xl font-semibold mb-6">개인정보처리방침</h1>

      <p>
        LOAGAP(이하 &quot;사이트&quot;)은 이용자의 개인정보를 중요시하며, 「개인정보 보호법」 등 관련 법령을 준수하고 있습니다.
        본 방침은 사이트가 어떤 정보를 수집하고, 어떻게 이용하며, 이를 보호하기 위해 어떤 조치를 취하고 있는지를 안내하기 위한 것입니다.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">1. 수집하는 개인정보 항목</h2>
      <p>사이트는 아래와 같은 정보를 수집할 수 있습니다.</p>
      <ul className="list-disc pl-5 space-y-1 mt-2">
        <li>서비스 이용 기록 (접속 일시, IP 주소, 브라우저 정보 등)</li>
        <li>쿠키를 통한 방문 및 이용 기록</li>
        <li>Google AdSense 및 웹 분석 도구(Google Analytics, Naver WCS 등)를 통해 수집되는 정보</li>
      </ul>

      <h2 className="text-lg font-semibold mt-6 mb-2">2. 개인정보 수집 및 이용 목적</h2>
      <p>수집한 개인정보는 다음의 목적을 위해 활용됩니다:</p>
      <ul className="list-disc pl-5 mt-2 space-y-1">
        <li>광고 노출 및 최적화</li>
        <li>서비스 이용 통계 분석</li>
        <li>사이트 품질 개선</li>
      </ul>

      <h2 className="text-lg font-semibold mt-6 mb-2">3. 개인정보 보유 및 이용 기간</h2>
      <p>
        원칙적으로 개인정보는 수집 및 이용 목적이 달성된 후 즉시 파기합니다.
        다만, 관련 법령에 따라 일정 기간 보관이 필요한 경우에는 해당 기간 동안 안전하게 보관합니다.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">4. 쿠키의 사용 및 거부</h2>
      <p>
        사이트는 Google AdSense 등의 광고 서비스 제공을 위해 쿠키(Cookie)를 사용할 수 있습니다.
        쿠키는 개인을 식별하지 않으며, 사용자에게 맞춤형 광고를 제공하기 위한 용도로만 활용됩니다.
        사용자는 웹 브라우저의 설정을 통해 쿠키 저장을 거부할 수 있습니다.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">5. 개인정보 보호 책임자 및 문의</h2>
      <p>
        사이트는 이용자의 개인정보를 보호하기 위해 최선을 다하고 있습니다. 개인정보 관련 문의사항은 아래 이메일로 연락해 주세요.
      </p>
      <p className="mt-2">
        이메일: <a href="mailto:loagapteam@gmail.com" className="text-blue-600 hover:underline">loagapteam@gmail.com</a>
      </p>

      <p className="text-xs text-gray-500 mt-10  dark:text-gray-400">
        본 개인정보처리방침은 2025년 6월 12일부터 적용됩니다.
      </p>
    </div>
  );
}
