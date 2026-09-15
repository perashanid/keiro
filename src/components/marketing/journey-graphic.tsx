const nodes = [
  { x: 40, y: 300, label: "Market", sub: "Bangladesh B2B" },
  { x: 220, y: 210, label: "Company", sub: "Square Pharma" },
  { x: 400, y: 260, label: "Decision-maker", sub: "Head of Procurement" },
  { x: 580, y: 150, label: "Opportunity", sub: "Qualified" },
  { x: 740, y: 90, label: "Customer", sub: "Won" },
];

/** The one hero graphic: the product journey rendered as the route motif. */
export function JourneyGraphic() {
  return (
    <svg
      viewBox="0 0 800 360"
      fill="none"
      className="w-full"
      role="img"
      aria-label="The Keiro journey from market to customer"
    >
      <path
        d="M40 300C120 300 130 210 220 210C300 210 320 260 400 260C470 260 490 150 580 150C640 150 660 90 740 90"
        stroke="var(--slate-500)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M40 300C120 300 130 210 220 210C300 210 320 260 400 260C470 260 490 150 580 150C640 150 660 90 740 90"
        stroke="var(--ivory)"
        strokeWidth="2"
        strokeDasharray="6 10"
        strokeLinecap="round"
        opacity="0.5"
      />
      {nodes.map((n, i) => (
        <g key={n.label}>
          <circle
            cx={n.x}
            cy={n.y}
            r={i === nodes.length - 1 ? 7 : 5}
            fill={i === nodes.length - 1 ? "var(--ivory)" : "var(--ink-950)"}
            stroke={i === nodes.length - 1 ? "var(--ivory)" : "var(--slate-300)"}
            strokeWidth="1.5"
          />
          <text
            x={n.x}
            y={i % 2 === 0 ? n.y + 28 : n.y - 20}
            textAnchor="middle"
            className="fill-mist"
            style={{ font: "500 13px var(--font-sans)" }}
          >
            {n.label}
          </text>
          <text
            x={n.x}
            y={i % 2 === 0 ? n.y + 46 : n.y - 4}
            textAnchor="middle"
            className="fill-slate-400"
            style={{ font: "400 11px var(--font-sans)" }}
          >
            {n.sub}
          </text>
        </g>
      ))}
    </svg>
  );
}
