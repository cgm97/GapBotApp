'use client';

import { useEffect, useRef, useMemo, useState } from 'react';
import { createChart, LineSeries } from 'lightweight-charts';

export default function LineChart({ rawData }) {
    const chartRef = useRef(null);
    const [seriesRefs, setSeriesRefs] = useState([]); // 시리즈 참조 저장

    const seriesColors = [
        '#1f77b4', // 파랑
        '#ff7f0e', // 주황
        '#2ca02c', // 초록
        '#d62728', // 빨강
        '#9467bd', // 보라
        '#8c564b', // 갈색
        '#e377c2', // 핑크
        '#7f7f7f', // 회색
        '#bcbd22', // 올리브
        '#17becf', // 청록
    ];

    const simplifyName = (name) =>
        name.replace('레벨 ', '')
            .replace('의 보석', '')
            .replace('겁화', '겁')
            .replace('작열', '작')
            .replace('각인서', '');

    const seriesData = useMemo(() => {
        if (!rawData) return [];
        return Object.entries(rawData).map(([name, data], i) => ({
            name: simplifyName(name),
            originalName: name,
            color: seriesColors[i % seriesColors.length],
            data: data.map(({ time, price }) => ({
                time,
                value: Number(price),
            })),
        }));
    }, [rawData]);

    useEffect(() => {
        if (!chartRef.current || seriesData.length === 0) return;

        const chart = createChart(chartRef.current, {
            width: chartRef.current.clientWidth,
            height: 300,
        });

        const refs = seriesData.map(({ color, data }) => {
            const series = chart.addSeries(LineSeries, {
                color,
                priceFormat: {
                    type: 'custom',
                    formatter: (val) => val.toLocaleString('ko-KR'),
                },
            });
            series.setData(data);
            return { series, visible: true };
        });

        setSeriesRefs(refs);

        const handleResize = () => {
            chart.applyOptions({ width: chartRef.current.clientWidth });
        };
        window.addEventListener('resize', handleResize);

        return () => {
            chart.remove();
            window.removeEventListener('resize', handleResize);
        };
    }, [seriesData]);

    const toggleSeries = (index) => {
        setSeriesRefs((prev) => {
            const next = [...prev];
            const { series, visible } = next[index];
            if (visible) {
                series.applyOptions({ visible: false });
            } else {
                series.applyOptions({ visible: true });
            }
            next[index] = { series, visible: !visible };
            return next;
        });
    };

    return (
        <>
            <div ref={chartRef} className="w-full h-[300px]" />

            <div className="flex justify-center gap-4 mt-2">
                {seriesData.map(({ name, color }, i) => (
                    <div
                        key={name}
                        onClick={() => toggleSeries(i)}
                        className={`
                            flex items-center gap-1.5 cursor-pointer
                            transition-opacity duration-200
                            ${seriesRefs[i]?.visible ? 'opacity-100' : 'opacity-30'}
                        `}
                    >
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: color }}
                        />
                        <span style={{ color }}>{name}</span>
                    </div>
                ))}
            </div>

        </>
    );
}
