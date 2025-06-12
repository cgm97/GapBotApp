export const metadata = {
  title: '이용약관 | LOAGAP',
  description: 'LOAGAP 서비스 이용 시 적용되는 약관입니다. 서비스 범위, 책임 한계, 사용자 의무 등을 안내합니다.',
  robots: 'index, follow',
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 text-sm text-gray-800 leading-6">
      <h1 className="text-2xl font-semibold mb-6">이용약관</h1>

      <p>
        본 이용약관은 LOAGAP(이하 &quot;사이트&quot;)과 사용자 간의 권리, 의무 및 책임사항을 규정하며,
        사용자는 본 사이트를 이용함으로써 본 약관의 내용에 동의한 것으로 간주됩니다.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">1. 서비스의 제공</h2>
      <p>
        사이트는 Lost Ark 관련 정보 및 아이템 가격 데이터 등의 콘텐츠를 사용자에게 제공합니다.
        제공되는 정보는 참고용이며, 정확성 및 신뢰성을 보장하지 않습니다.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">2. 저작권 및 콘텐츠 이용</h2>
      <p>
        사이트에 게시된 모든 콘텐츠(텍스트, 이미지, 데이터 등)의 저작권은 LOAGAP 또는 제휴 파트너에게 있으며,
        명시적인 사전 동의 없이 이를 복제, 배포, 수정하거나 상업적으로 이용하는 행위를 금합니다.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">3. 책임의 한계</h2>
      <p>
        사이트는 사용자에게 제공되는 정보의 정확성 또는 완전성에 대해 보증하지 않으며,
        해당 정보를 기반으로 한 사용자의 판단 또는 외부 링크 및 광고 이용에 대해 어떠한 책임도 지지 않습니다.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">4. 이용자의 의무</h2>
      <p>
        사용자는 사이트 이용 시 관련 법령을 준수하여야 하며, 사이트의 정상적인 운영을 방해하는 행위를 해서는 안 됩니다.
        부정한 방법으로 정보 수집, 자동화된 접근 등은 금지됩니다.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">5. 약관의 변경</h2>
      <p>
        본 약관은 관련 법령이나 내부 정책에 따라 사전 고지 없이 변경될 수 있습니다.
        변경된 약관은 사이트에 게시함으로써 그 효력이 발생하며, 이후 서비스를 계속 이용할 경우 변경된 약관에 동의한 것으로 간주됩니다.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">6. 문의</h2>
      <p>
        본 약관에 대한 문의사항은 아래 이메일로 연락 주시기 바랍니다.
      </p>
      <p className="mt-2">
        이메일: <a href="mailto:loagapteam@gmail.com" className="text-blue-600 hover:underline">loagapteam@gmail.com</a>
      </p>

      <p className="text-xs text-gray-500 mt-10">
        본 약관은 2025년 6월 12일부터 적용됩니다.
      </p>
    </div>
  );
}