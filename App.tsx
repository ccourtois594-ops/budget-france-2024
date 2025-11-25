
import React, { useRef, useState } from 'react';
import { SankeyChart } from './components/SankeyChart';
import { ChatInterface } from './components/ChatInterface';
import { budget2024 } from './data/budget2024';
import { Info, Loader2, FileDown } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

function App() {
  const chartRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = async () => {
    if (!chartRef.current || isExporting) return;

    setIsExporting(true);

    // Sauvegarde des styles originaux
    const element = chartRef.current;
    const originalWidth = element.style.width;
    const originalHeight = element.style.height;
    const originalMinHeight = element.style.minHeight;
    const originalTransition = element.style.transition;

    try {
      // 1. Préparation pour l'impression : on force une taille fixe idéale
      // Largeur 1600px (équivalent A3 écran) pour que la police taille 14px soit lisible
      // Hauteur 900px pour un ratio 16:9
      element.style.transition = 'none'; // Désactiver les animations pour le resize immédiat
      element.style.width = '1600px';
      element.style.height = '900px';
      element.style.minHeight = '900px';
      element.style.backgroundColor = '#ffffff';

      // 2. Attendre que Recharts redessine le SVG (ResizeObserver + Render cycle)
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 3. Capture avec html2canvas
      // scale: 2 permet d'avoir une image finale de 3200x1800 px (très net)
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: 1600, // Force la largeur de capture
        height: 900,
        windowWidth: 1600, // Simule une fenêtre large
        windowHeight: 900
      });

      const imgData = canvas.toDataURL('image/png');
      
      // 4. Génération PDF A3 Paysage (420mm x 297mm)
      const pdf = new jsPDF('l', 'mm', 'a3');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // En-tête PDF
      pdf.setFontSize(22);
      pdf.setTextColor(30, 41, 59); // Slate 800
      pdf.text("Budget de l'État 2024 - Flux Financiers Complets", 15, 20);
      
      pdf.setFontSize(10);
      pdf.setTextColor(100);
      pdf.text(`Document généré le ${new Date().toLocaleDateString()}`, 15, 27);

      // Calcul des dimensions pour conserver le ratio
      const margin = 15;
      const headerHeight = 25;
      const availableWidth = pdfWidth - (margin * 2);
      const availableHeight = pdfHeight - margin - headerHeight;

      const imgRatio = canvas.width / canvas.height;
      const pageRatio = availableWidth / availableHeight;

      let printWidth, printHeight;

      if (imgRatio > pageRatio) {
        // L'image est plus large que la zone dispo
        printWidth = availableWidth;
        printHeight = availableWidth / imgRatio;
      } else {
        // L'image est plus haute
        printWidth = availableHeight * imgRatio;
        printHeight = availableHeight;
      }

      // Centrage
      const x = margin + (availableWidth - printWidth) / 2;
      const y = headerHeight + (availableHeight - printHeight) / 2;

      pdf.addImage(imgData, 'PNG', x, y, printWidth, printHeight);
      
      pdf.save('eco-budget-france-2024-complet.pdf');

    } catch (error) {
      console.error("Erreur lors de l'export PDF:", error);
      alert("Une erreur est survenue lors de la génération du PDF.");
    } finally {
      // 5. Restauration de l'état initial
      element.style.width = originalWidth;
      element.style.height = originalHeight;
      element.style.minHeight = originalMinHeight;
      element.style.transition = originalTransition;
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative">
      {/* Overlay de chargement pendant l'export */}
      {isExporting && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex flex-col items-center justify-center text-white">
          <Loader2 size={48} className="animate-spin mb-4" />
          <p className="text-xl font-medium">Génération du PDF haute définition...</p>
          <p className="text-sm opacity-80 mt-2">Veuillez patienter, redimensionnement du graphique en cours.</p>
        </div>
      )}

      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center justify-center gap-[2px] h-8 w-8 bg-slate-100 rounded border border-slate-200 p-1">
                 <div className="w-full h-full bg-blue-600 rounded-[1px]"></div>
                 <div className="w-full h-full bg-white rounded-[1px]"></div>
                 <div className="w-full h-full bg-red-600 rounded-[1px]"></div>
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-none">
                  RÉPUBLIQUE FRANÇAISE
                </h1>
                <p className="text-xs text-slate-500 font-medium">Budget de l'État 2024</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a 
                href="https://www.budget.gouv.fr/budget-etat/budget-2024" 
                target="_blank" 
                rel="noreferrer"
                className="hidden md:flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-700 transition-colors"
              >
                <Info size={16} />
                Documentation Officielle
              </a>
              <div className="h-8 w-[1px] bg-slate-200 hidden md:block"></div>
              <button 
                onClick={handleExportPDF}
                disabled={isExporting}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-70 disabled:cursor-wait"
              >
                {isExporting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Export...</span>
                  </>
                ) : (
                  <>
                    <FileDown size={16} />
                    <span>Exporter PDF</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Left Column: Visualization */}
          <div className="w-full lg:w-2/3">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-slate-900">Architecture Budgétaire</h2>
              <p className="text-slate-500 mt-1">
                Visualisez les flux financiers de l'origine des recettes jusqu'au détail précis des dépenses. 
                Les données sont issues du Projet de Loi de Finances (PLF) 2024.
              </p>
            </div>
            
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-sm">
                <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Recettes Fiscales Nettes</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">~318 Md€</p>
                <p className="text-xs text-slate-400 mt-2">Principalement TVA & Impôts</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-rose-100 shadow-sm">
                 <p className="text-xs font-semibold text-rose-600 uppercase tracking-wider">Déficit Budgétaire</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">~144 Md€</p>
                <p className="text-xs text-slate-400 mt-2">Besoin de financement</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-indigo-100 shadow-sm">
                <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Charge de la Dette</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">~56 Md€</p>
                <p className="text-xs text-slate-400 mt-2">En forte augmentation</p>
              </div>
            </div>

            <SankeyChart data={budget2024} printRef={chartRef} />
          </div>

          {/* Right Column: Chat & Analysis */}
          <div className="w-full lg:w-1/3 flex flex-col gap-6">
            <div className="lg:mt-[88px]"> {/* Align with chart top */}
               <ChatInterface />
            </div>
            
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
              <h3 className="text-blue-900 font-semibold mb-2">Le saviez-vous ?</h3>
              <p className="text-sm text-blue-800 leading-relaxed">
                Le premier poste de dépenses de l'État reste l'Enseignement scolaire. 
                Cependant, la charge de la dette (les intérêts payés sur la dette passée) est devenue l'un des postes majeurs, dépassant désormais la mission Défense.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
