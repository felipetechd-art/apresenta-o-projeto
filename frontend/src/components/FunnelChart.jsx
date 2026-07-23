import React from 'react';

const FunnelChart = ({ data = [], generalConversionRate = 3.6 }) => {
  // SVG Dimensions
  const svgWidth = 260;
  const svgHeight = 280;
  const strokeWidth = 4;
  const strokeColor = '#0b1329'; // Matches card background to make clean gaps

  // Linear taper calculations
  // Top width = 240, Bottom width = 40, Height = 280
  const topWidth = 240;
  const bottomWidth = 40;
  const centerX = svgWidth / 2; // 130

  // Calculate X coordinate at a given Y
  const getWidthAtY = (y) => {
    return topWidth - ((topWidth - bottomWidth) * y) / svgHeight;
  };

  const segments = data.map((item, idx) => {
    const yStart = (idx * svgHeight) / data.length;
    const yEnd = ((idx + 1) * svgHeight) / data.length;

    const wStart = getWidthAtY(yStart);
    const wEnd = getWidthAtY(yEnd);

    const x1 = centerX - wStart / 2; // Top-left
    const x2 = centerX + wStart / 2; // Top-right
    const x3 = centerX + wEnd / 2;   // Bottom-right
    const x4 = centerX - wEnd / 2;   // Bottom-left

    const points = `${x1},${yStart} ${x2},${yStart} ${x3},${yEnd} ${x4},${yEnd}`;

    return {
      ...item,
      points,
      yCenter: (yStart + yEnd) / 2
    };
  });

  return (
    <div className="flex flex-col h-full justify-between">
      {/* Funnel Body */}
      <div className="flex items-center gap-6 mt-4 flex-1">
        {/* SVG Funnel Graphic */}
        <div className="w-1/2 flex justify-center">
          <svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="max-h-[260px] drop-shadow-[0_8px_16px_rgba(0,0,0,0.4)]"
          >
            <defs>
              {/* Subtle vertical gradient for funnel pieces */}
              {segments.map((seg, idx) => (
                <linearGradient key={idx} id={`grad-${idx}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={seg.color} stopOpacity={1} />
                  <stop offset="100%" stopColor={seg.color} stopOpacity={0.8} />
                </linearGradient>
              ))}
            </defs>
            {segments.map((seg, idx) => (
              <polygon
                key={idx}
                points={seg.points}
                fill={`url(#grad-${idx})`}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                className="transition-all duration-300 hover:brightness-125 cursor-pointer origin-center hover:scale-[1.02]"
              />
            ))}
          </svg>
        </div>

        {/* Funnel Data Details */}
        <div className="w-1/2 flex flex-col justify-between h-full py-1 text-xs">
          {/* Header */}
          <div className="grid grid-cols-12 text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-2 border-b border-dark-border pb-1">
            <div className="col-span-6">Etapa</div>
            <div className="col-span-3 text-right">Qtde</div>
            <div className="col-span-3 text-right">Conversão</div>
          </div>

          {/* List of stages */}
          <div className="flex flex-col justify-between flex-grow gap-2">
            {segments.map((item, idx) => (
              <div
                key={idx}
                className="grid grid-cols-12 items-center hover:bg-white/5 py-1 px-1.5 rounded transition-all duration-150 group cursor-pointer"
              >
                {/* Stage Indicator & Name */}
                <div className="col-span-6 flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 group-hover:scale-125 transition-transform"
                    style={{ backgroundColor: item.color }}
                  ></span>
                  <span className="text-gray-300 font-medium truncate group-hover:text-white transition-colors">
                    {item.stage}
                  </span>
                </div>
                {/* Quantity */}
                <div className="col-span-3 text-right text-gray-300 font-semibold font-mono">
                  {item.count.toLocaleString('pt-BR')}
                </div>
                {/* Conversion Rate */}
                <div className="col-span-3 text-right text-gray-400 font-mono font-medium">
                  {item.conversion}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Conversion Rate Bottom */}
      <div className="mt-4 pt-2 border-t border-dark-border flex items-center justify-between text-xs">
        <span className="text-gray-400">Taxa geral de conversão:</span>
        <span className="text-status-blue font-bold font-mono text-sm bg-status-blue/10 px-2 py-0.5 rounded">
          {generalConversionRate}%
        </span>
      </div>
    </div>
  );
};

export default FunnelChart;
