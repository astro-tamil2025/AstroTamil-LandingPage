"use client";

import { useMemo } from "react";

type Props = {
  svg: string;
};

export default function ChartDisplay({ svg }: Props) {
  const processedSvg = useMemo(() => {
    if (!svg) return "";
    
    try {
      // Parse and modify SVG to make it responsive
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svg, "image/svg+xml");
      const svgElement = svgDoc.documentElement;
      
      // Make SVG responsive
      svgElement.setAttribute("width", "100%");
      svgElement.setAttribute("height", "auto");
      const viewBox = svgElement.getAttribute("viewBox") || "0 0 500 500";
      svgElement.setAttribute("viewBox", viewBox);
      svgElement.setAttribute("preserveAspectRatio", "xMidYMid meet");
      svgElement.setAttribute("style", "max-width: 100%; height: auto;");
      
      return svgElement.outerHTML;
    } catch {
      return svg;
    }
  }, [svg]);

  if (!svg) return null;

  return (
    <div className="rounded-xl border-2 border-[#f0df20] bg-gradient-to-br from-[#fff3a6] to-[#fff8d5] p-4 shadow-[0_8px_24px_rgba(240,223,32,0.2)] w-[min(100%,28rem)] text-black">
      <div className="font-bold mb-3 text-base flex items-center gap-2">
        <span>RASI Chart</span>
        <div className="flex-1 h-[1px] bg-black/10"></div>
      </div>
      <div 
        className="w-full max-w-full overflow-auto flex justify-center bg-white/50 rounded-lg p-2"
        style={{ maxHeight: "500px" }}
        dangerouslySetInnerHTML={{ __html: processedSvg }}
      />
    </div>
  );
}

