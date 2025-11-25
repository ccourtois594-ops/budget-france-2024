
import React, { useMemo, useState } from 'react';
import { Sankey, Tooltip, ResponsiveContainer, TooltipProps, Layer, Rectangle } from 'recharts';
import { BudgetData } from '../types';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface SankeyChartProps {
  data: BudgetData;
  printRef?: React.RefObject<HTMLDivElement | null>;
}

// Color Palette Definition
const NODE_COLORS: Record<string, string> = {
  // Segmentation (New Col 0 - Pastels/Distinctions)
  "Ménages - Revenus Modestes": "#fdba74", // orange-300
  "Ménages - Classes Moyennes": "#fb923c", // orange-400
  "Ménages - Hauts Revenus": "#ea580c",    // orange-600
  "TPE & PME": "#93c5fd",                  // blue-300
  "Grandes Entreprises & ETI": "#3b82f6",  // blue-500
  "Investisseurs Institutionnels": "#fda4af", // rose-300
  "Bailleurs & Actionnaires": "#cbd5e1",      // slate-300

  // Origin (Col 1)
  "Ménages & Particuliers": "#c2410c", // orange-700
  "Entreprises": "#1d4ed8",            // blue-700
  "Marchés Financiers": "#881337",     // rose-900 
  "Divers & Europe": "#64748b",        // slate-500

  // Resources (Incoming - Green/Teal/Blue spectrum)
  "TVA": "#059669",             // emerald-600
  "Impôt sur le Revenu": "#10b981", // emerald-500
  "Impôt sur les Sociétés": "#34d399", // emerald-400
  "TICPE (Carburants)": "#06b6d4",     // cyan-500
  "Autres Recettes Fiscales": "#2dd4bf", // teal-400
  "Recettes Non Fiscales": "#99f6e4",    // teal-200
  "Déficit / Emprunt": "#e11d48",        // rose-600

  // Center
  "Budget Général de l'État": "#1e293b", // slate-800

  // Missions (Purple/Orange/Blue Mix)
  "Enseignement Scolaire": "#4f46e5",    // indigo-600
  "Recherche & Ens. Sup.": "#6366f1",    // indigo-500
  "Défense": "#d97706",                  // amber-600
  "Sécurité": "#f59e0b",                 // amber-500
  "Justice": "#fbbf24",                  // amber-400
  "Solidarité & Insertion": "#db2777",   // pink-600
  "Travail & Emploi": "#ec4899",         // pink-500
  "Écologie & Transport": "#0ea5e9",     // sky-500
  "Collectivités Terr.": "#0284c7",      // sky-600
  "Autres Missions": "#64748b",          // slate-500
  "Charge de la Dette": "#9f1239",       // rose-800

  // Nature (Col 5 - Intermediate Blue/Grey)
  "Dépenses de Personnel": "#475569",    // slate-600
  "Intérêts Financiers": "#9f1239",      // rose-800 (match Charge dette)
  "Interventions & Transferts": "#64748b", // slate-500
  "Fonctionnement & Invest.": "#334155", // slate-700

  // Details (Col 6 - Final Breakdown - High Contrast)
  "Salaires & Traitements": "#4338ca",   // indigo-700
  "Aides aux Ménages": "#be185d",        // pink-700
  "Aides aux Entreprises": "#be185d",    // pink-700
  "Dotations Collectivités": "#0369a1",  // sky-700
  "Contribution UE": "#1d4ed8",          // blue-700
  "Armement & Équipement": "#b45309",    // amber-700
  "Infra. & Immobilier": "#0f766e",      // teal-700
  "Fonctionnement Services": "#15803d",  // green-700
  "Intérêts de la Dette": "#881337",     // rose-900
};

const DEFAULT_COLOR = "#cbd5e1";

// Custom Tooltip
const CustomTooltip = ({ active, payload }: TooltipProps<any, any>) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    const isLink = data.payload.source && data.payload.target;
    
    return (
      <div className="bg-white border border-slate-200 shadow-xl p-4 rounded-lg text-sm z-50 min-w-[200px]">
        {isLink ? (
          <>
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100">
               <div className="w-3 h-3 rounded-full" style={{ backgroundColor: NODE_COLORS[data.payload.source.name] || DEFAULT_COLOR }}></div>
               <span className="font-semibold text-slate-700">{data.payload.source.name}</span>
            </div>
            <div className="flex justify-center my-1 text-slate-400">↓</div>
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100">
               <div className="w-3 h-3 rounded-full" style={{ backgroundColor: NODE_COLORS[data.payload.target.name] || DEFAULT_COLOR }}></div>
               <span className="font-semibold text-slate-700">{data.payload.target.name}</span>
            </div>
            <p className="text-center mt-3 font-bold text-lg text-blue-600 bg-blue-50 py-1 rounded">
              {data.value.toFixed(1)} Md€
            </p>
          </>
        ) : (
          <>
            <p className="font-bold text-slate-800 text-lg mb-1">{data.payload.name}</p>
            <div className="flex items-center justify-between mt-2">
               <span className="text-slate-500">Montant total:</span>
               <span className="text-blue-600 font-bold text-lg">{data.value.toFixed(1)} Md€</span>
            </div>
          </>
        )}
      </div>
    );
  }
  return null;
};

// Custom Node Component
const renderNode = (props: any) => {
  const { x, y, width, height, index, payload } = props;
  const isCenter = payload.name === "Budget Général de l'État";
  const category = payload.category;

  const color = NODE_COLORS[payload.name] || DEFAULT_COLOR;

  // Typography
  const fontSize = isCenter ? 14 : 11;
  const fontWeight = isCenter ? 700 : 500;
  
  // Text Positioning Logic
  let textX, textAnchor, dy;
  
  if (category === 'actor_segmentation') {
      // COL 0: Far Left
      textX = x - 8;
      textAnchor = "end";
      dy = 4;
  } else if (category === 'resource_origin') {
      // COL 1: Left Intermediate
      textX = x + width / 2; 
      textAnchor = "middle";
      dy = -6;
  } else if (category === 'resource') {
      // COL 2: Resources
      textX = x + width / 2;
      textAnchor = "middle";
      dy = -6; 
  } else if (category === 'expense_detail') {
      // COL 6: Right outside
      textX = x + width + 8; 
      textAnchor = "start";
      dy = 4;
  } else if (category === 'expense_nature') {
      // COL 5: Intermediate
      textX = x + width / 2;
      textAnchor = "middle";
      dy = -6; 
  } else if (isCenter) {
      // COL 3: Center
      textX = x + width / 2;
      textAnchor = "middle";
      dy = 4;
  } else {
      // COL 4 (Missions): Middle - Crowd management
      textX = x + width + 6;
      textAnchor = "start";
      dy = 4;
  }

  // Handle very small bars
  const minHeight = Math.max(height, 4);

  // Check if we should show value label
  const showValue = height > 20 || category === 'actor_segmentation' || category === 'expense_detail';

  return (
    <Layer key={`node-${index}`}>
      <Rectangle
        x={x}
        y={y}
        width={width}
        height={minHeight}
        fill={color}
        fillOpacity={1}
        radius={[2, 2, 2, 2]}
        className="transition-opacity hover:opacity-80 cursor-pointer"
      />
      
      <text
        x={textX}
        y={y + height / 2}
        dy={dy}
        textAnchor={textAnchor}
        fontSize={fontSize}
        fontWeight={fontWeight}
        fill="#334155"
        style={{ pointerEvents: 'none', textShadow: "0px 1px 2px white" }}
      >
        {payload.name}
      </text>
      
      {/* Value Label */}
      {showValue && (
         <text
           x={textX}
           y={y + height / 2 + 12}
           dy={category === 'resource' || category === 'expense_nature' || category === 'resource_origin' ? 0 : 4}
           textAnchor={textAnchor}
           fontSize={9}
           fill="#64748b"
           style={{ pointerEvents: 'none', textShadow: "0px 1px 2px white" }}
         >
           {Math.round(payload.value)}
         </text>
      )}
    </Layer>
  );
};

export const SankeyChart: React.FC<SankeyChartProps> = ({ data, printRef }) => {
  const [zoomLevel, setZoomLevel] = useState(1);

  const chartData = useMemo(() => {
    const nodes = data.nodes;
    const nodeMap = new Map(nodes.map((node, i) => [node.name, i]));
    
    // Recharts requires numeric source/target indices
    const links = data.links.map(link => ({
      source: nodeMap.get(link.source) ?? 0,
      target: nodeMap.get(link.target) ?? 0,
      value: link.value,
      originalSource: link.source,
      originalTarget: link.target
    }));

    return { nodes, links };
  }, [data]);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  const handleReset = () => setZoomLevel(1);

  return (
    <div className="w-full bg-white rounded-xl shadow-md border border-slate-200 p-6 h-[800px] flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-slate-100 pb-4 shrink-0">
        <div>
           <h2 className="text-2xl font-bold text-slate-800 flex items-center">
            <span className="w-3 h-8 bg-blue-600 rounded-sm mr-3"></span>
            Flux Budgétaires 2024
          </h2>
          <p className="text-slate-500 mt-1 text-sm ml-6">
             Sociologie → Acteurs → Impôts → Budget → Missions → Nature → Détail
          </p>
        </div>
        <div className="hidden 2xl:flex gap-4 text-xs font-medium mt-4 sm:mt-0">
            <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-orange-400"></span> Segmentation
            </div>
            <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-orange-700"></span> Acteurs
            </div>
            <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Fiscalité
            </div>
             <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-800"></span> Budget
            </div>
            <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-600"></span> Missions
            </div>
            <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-pink-700"></span> Détail
            </div>
        </div>
      </div>

      <div className="flex-1 w-full min-h-0 relative border border-slate-100 rounded-lg overflow-hidden bg-slate-50/30 group">
        
        {/* Zoom Controls */}
        <div data-html2canvas-ignore className="absolute top-4 right-4 z-20 flex items-center bg-white/90 backdrop-blur-sm border border-slate-200 shadow-sm rounded-lg p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button 
                onClick={handleZoomOut} 
                className="p-2 hover:bg-slate-100 rounded text-slate-600 transition-colors" 
                title="Zoom arrière"
                disabled={zoomLevel <= 0.5}
            >
                <ZoomOut size={16} className={zoomLevel <= 0.5 ? 'opacity-50' : ''} />
            </button>
            <div className="w-12 text-center text-xs font-bold text-slate-700 select-none">
                {Math.round(zoomLevel * 100)}%
            </div>
            <button 
                onClick={handleZoomIn} 
                className="p-2 hover:bg-slate-100 rounded text-slate-600 transition-colors" 
                title="Zoom avant"
                disabled={zoomLevel >= 3}
            >
                <ZoomIn size={16} className={zoomLevel >= 3 ? 'opacity-50' : ''} />
            </button>
            <div className="w-[1px] h-4 bg-slate-200 mx-1"></div>
            <button 
                onClick={handleReset} 
                className="p-2 hover:bg-slate-100 rounded text-slate-600 transition-colors"
                title="Réinitialiser le zoom"
            >
              <RotateCcw size={16} />
            </button>
        </div>

        <div className="w-full h-full overflow-auto" id="chart-scroll-container">
          <div 
            ref={printRef}
            className="transition-all duration-300 ease-in-out origin-top-left bg-white"
            style={{ 
              width: `${zoomLevel * 100}%`, 
              height: `${zoomLevel * 100}%`,
              minWidth: '100%', 
              minHeight: '100%' 
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <Sankey
                data={chartData}
                margin={{ top: 20, right: 200, bottom: 20, left: 220 }}
                nodeWidth={10}
                nodePadding={24}
                linkCurvature={0.4}
                iterations={64}
                node={renderNode}
              >
                <Tooltip content={<CustomTooltip />} />
              </Sankey>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
