'use client';

import { useEffect, useRef } from 'react';
import { createChart, CandlestickSeries } from 'lightweight-charts';

export default function CandleChart({ chartData }) {
    const chartContainerRef = useRef(null);
    const tooltipRef = useRef(null);
    const candleSeriesRef = useRef(null);
    const chartRef = useRef(null);

    const rawData = chartData;

    useEffect(() => {
        const chart = createChart(chartContainerRef.current, {
            width: chartContainerRef.current.clientWidth,
            height: 400,
            layout: {
                background: { color: '#fff' },
                textColor: '#333',
            },
            grid: {
                vertLines: { color: '#eee' },
                horzLines: { color: '#eee' },
            },
            timeScale: {
                timeVisible: true,
            }
        });

        const candleSeries = chart.addSeries(CandlestickSeries, { type: 'Candlestick' });
        candleSeriesRef.current = candleSeries;
        chartRef.current = chart;

        candleSeries.applyOptions({
            priceFormat: {
                type: 'custom',
                formatter: (val) => val.toLocaleString('ko-KR'),
            }
        });

        // 9시간 보정 - 힌국시간으로 하기위함.
        const correctedData = rawData.map(d => ({
            ...d,
            time: d.time + 9 * 60 * 60,
        }));

        const SOME_THRESHOLD = 500;

        function fixCandleData(data) {
            if (!data || data.length === 0) return data;

            const fixedData = [...data];
            for (let i = 1; i < fixedData.length; i++) {
                const prev = fixedData[i - 1];
                const curr = fixedData[i];
                // 현재 캔들 open과 이전 캔들 close가 차이가 크면 open 값을 이전 close 값으로 보정
                if (Math.abs(curr.open - prev.close) > SOME_THRESHOLD) {
                    curr.open = prev.close;
                }
            }
            return fixedData;
        }

        candleSeries.setData(fixCandleData(correctedData));

        // Create and style the tooltip html element
        const toolTip = document.createElement('div');
        toolTip.style = `
            position: absolute;
            display: none;
            padding: 8px 12px;
            background: rgba(30, 30, 30, 0.9);
            color: #f0f0f0;
            border-radius: 6px;
            font-size: 13px;
            line-height: 1.5;
            white-space: nowrap;
            pointer-events: none;
            z-index: 1000;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            user-select: none;
        `;

        toolTip.style.background = 'white';
        toolTip.style.color = 'black';
        toolTip.style.borderColor = '#2962FF';
        chartContainerRef.current.appendChild(toolTip);

        chart.subscribeCrosshairMove(param => {
            if (!param.point || !param.time || param.point.x < 0 || param.point.y < 0) {
                toolTip.style.display = 'none';
                return;
            }
            console.log(param);
            const series = candleSeriesRef.current;
            const data = param.seriesData.get(series);
            if (!data) {
                toolTip.style.display = 'none';
                return;
            }

            const dateStr = new Date(param.time * 1000).toLocaleString('ko-KR', { timeZone: 'UTC' });

            toolTip.style.display = 'block';
            toolTip.innerHTML = `
                    <div>${dateStr}</div>
                    <div>시: ${data.open.toLocaleString()}</div>
                    <div>고: ${data.high.toLocaleString()}</div>
                    <div>저: ${data.low.toLocaleString()}</div>
                    <div>종: ${data.close.toLocaleString()}</div>
                `;

            const containerRect = chartContainerRef.current.getBoundingClientRect();
            const timeScale = chart.timeScale();
            const coordinate = timeScale.timeToCoordinate(param.time);

            if (coordinate === null) {
                toolTip.style.display = 'none';
                return;
            }

            const tooltipWidth = toolTip.offsetWidth;
            const tooltipHeight = toolTip.offsetHeight;

            // 툴팁이 차트 컨테이너 내부에 있으므로 containerRect.left 더하지 않음
            let x = coordinate + 10; // 캔들 옆 10px 이동
            let y = 200; // 차트 위쪽 20px 고정 (필요시 조정)

            // 오른쪽으로 넘치는지 체크 (컨테이너 너비 기준)
            const containerWidth = chartContainerRef.current.clientWidth;

            if (x + tooltipWidth > containerWidth) {
                x = coordinate - tooltipWidth - 10;
            }

            toolTip.style.left = `${x}px`;
            toolTip.style.top = `${y}px`;
        });

        return () => {
            chart.remove();
            if (tooltipRef.current) {
                tooltipRef.current.remove();
            }
        };
    }, []);

    return <div ref={chartContainerRef} className="relative w-full h-[400px] rounded-md border border-gray-200 shadow-inner" />;

}
