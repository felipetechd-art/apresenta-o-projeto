import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const HorizontalFunnel = ({ data = [], generalConversionRate = 3.6, targetConversionRate = 5.0 }) => {
  // SVG viewBox settings
  const svgWidth = 800;
  const svgHeight = 80;
  
  // Segment math: W = 127, indent = 15. Overlaps are xStart = i * 112
  const segmentWidth = 127;
  const indent = 15;
  const height = 80;

  return (
    <div className="w-full flex flex-col justify-between h-full">
      {/* Scrollable container for smaller screens to prevent squeezing */}
      <div className="w-full overflow-x-auto scrollbar-thin pb-2">
        <div className="min-w-[760px] relative">
          <svg
            width="100%"
            height={svgHeight}
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="drop-shadow-[0_4px_10px_rgba(0,0,0,0.3)]"
          >
            {data.map((item, idx) => {
              const xStart = idx * 112;
              
              // Points calculation
              let points = "";
              if (idx === 0) {
                // First segment (flat left, arrow right)
                points = `0,0 ${segmentWidth - indent},0 ${segmentWidth},${height / 2} ${segmentWidth - indent},${height} 0,${height}`;
              } else {
                // Nested segments (arrow left indent, arrow right point)
                points = `${xStart + indent},0 ${xStart + segmentWidth - indent},0 ${xStart + segmentWidth},${height / 2} ${xStart + segmentWidth - indent},${height} ${xStart + indent},${height} ${xStart},${height / 2}`;
              }

              // Text center calculation
              const xCenter = idx === 0 ? 56 : xStart + 63.5;

              return (
                <g key={idx} className="group cursor-pointer">
                  {/* Chevron slice */}
                  <polygon
                    points={points}
                    fill={item.color}
                    fillOpacity={0.8}
                    stroke="#0b1329"
                    strokeWidth={2}
                    className="transition-all duration-200 hover:fill-opacity-100 hover:scale-[1.01] origin-center"
                  />
                  
                  {/* Stage Label */}
                  <text
                    x={xCenter}
                    y="28"
                    textAnchor="middle"
                    fill="#cbd5e1"
                    fontSize="9"
                    fontWeight="700"
                    fontFamily="Inter"
                    letterSpacing="0.05em"
                    className="pointer-events-none uppercase"
                  >
                    {item.stage}
                  </text>
                  
                  {/* Quantity Value */}
                  <text
                    x={xCenter}
                    y="52"
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="15"
                    fontWeight="800"
                    fontFamily="Outfit"
                    className="pointer-events-none"
                  >
                    {item.count.toLocaleString('pt-BR')}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Under-chevron rates and labels */}
          <div className="grid grid-cols-7 mt-2 text-center text-[10px] text-gray-400 font-mono px-2">
            {data.map((item, idx) => {
              const hasRate = idx > 0;
              const isUp = item.trend === 'up';
              
              return (
                <div key={idx} className="flex flex-col items-center justify-start min-h-[35px]">
                  {hasRate ? (
                    <>
                      <span className="text-white font-bold">{item.conversion}%</span>
                      {item.trend !== 'none' && (
                        <span className={`flex items-center gap-0.5 text-[9px] font-bold ${
                          isUp ? 'text-status-green' : 'text-status-red'
                        }`}>
                          {isUp ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                          {item.change.toLocaleString('pt-BR')} p.p.
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-gray-600 font-bold">—</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between text-xs text-gray-400 mt-4 border-t border-dark-border pt-3">
        <span className="text-gray-400">
          Taxa geral de conversão: <strong className="text-status-blue font-mono font-bold text-sm bg-status-blue/10 px-2 py-0.5 rounded ml-1">{generalConversionRate}%</strong>
        </span>
        <span className="text-gray-500 font-medium">
          Meta: <strong className="text-gray-300 font-mono font-bold text-sm bg-gray-500/10 px-2 py-0.5 rounded ml-1">{targetConversionRate}%</strong>
        </span>
      </div>
    </div>
  );
};

export default HorizontalFunnel;
