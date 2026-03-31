import React, { useEffect, useRef, memo } from "react";


function TradingViewWidget({ height = 80, width = '100%', symbol = 'BSE:SENSEX', theme = 'light' }) {
  const container = useRef();

  useEffect(() => {
    // Remove previous widget if any
    if (container.current) {
      container.current.innerHTML = "";
    }
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `{
      "allow_symbol_change": false,
      "calendar": false,
      "details": false,
      "hide_side_toolbar": true,
      "hide_top_toolbar": false,
      "hide_legend": false,
      "hide_volume": false,
      "interval": "D",
      "locale": "en",
      "save_image": true,
      "style": "1",
      "symbol": "${symbol}",
      "theme": "${theme}",
      "timezone": "Etc/UTC",
      "height": ${typeof height === 'number' ? height : `\"${height}\"`},
      "width": ${typeof width === 'number' ? width : `\"${width}\"`}
    }`;
    container.current.appendChild(script);
  }, [height, width, symbol, theme]);

  return (
    <div
      className="tradingview-widget-container"
      ref={container}
      style={{
        width: width,
        height: height,
        borderRadius: 10,
        overflow: "hidden",
      }}
    >
      <div
        className="tradingview-widget-container__widget"
        style={{ width: "100%", height: "100%" }}
      ></div>
      <div className="tradingview-widget-copyright">
        <a
          href="https://www.tradingview.com/symbols/BSE-SENSEX/"
          rel="noopener nofollow"
          target="_blank"
        >
          <span className="blue-text">SENSEX chart</span>
        </a>
        <span className="trademark"> by TradingView</span>
      </div>
    </div>
  );
}

export default TradingViewWidget;
