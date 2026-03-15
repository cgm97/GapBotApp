export default function Banner({ img, link, maxWidth = 800, showContact = false}) {
  return (
    <div className={`relative mx-auto w-full max-w-[${maxWidth}px]`}>
        <a href={link} target="_blank" rel="noopener noreferrer" className="block">
            <img
                src={img}
                alt="광고 배너"
                className="w-full object-cover rounded"
            />
        </a>
        {showContact && (
            <a
                href="https://superb-antler-e73.notion.site/LOAGAP-324c5e5dcbb180b6a0ddd082aca7957c"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-4 right-2 text-xs bg-white/80 text-gray-100 px-2 py-1 rounded hover:bg-white shadow z-20"
                style={{ color: "black" }}
                >
                📢 광고 배너 문의
            </a>
        )}
    </div>
  );
}