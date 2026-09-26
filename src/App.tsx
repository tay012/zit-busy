import { useState, useEffect, useCallback } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { CityProvider } from './contexts/CityContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { ReportsProvider } from './contexts/ReportsContext';
import { FilterProvider, useFilters } from './contexts/FilterContext';
import Navbar from './components/Navbar';
import FilterRail from './components/FilterRail';
import Feed from './components/Feed';
import DetailPanel from './components/DetailPanel';
import FilterPanel from './components/FilterPanel';
import ReportSheet from './components/ReportSheet';
import Footer from './components/Footer';

function AppInner() {
  const { filters, results, tick, openDraft } = useFilters();
  const [selectedVenue, setSelectedVenue] = useState<string | null>(null);
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState<string | null>(null);

  const openDetail = useCallback((name: string) => setSelectedVenue(name), []);
  const closeDetail = useCallback(() => setSelectedVenue(null), []);

  const openFilterPanel = useCallback(() => {
    openDraft();
    setFilterPanelOpen(true);
  }, [openDraft]);
  const closeFilterPanel = useCallback(() => setFilterPanelOpen(false), []);

  const openReport = useCallback((name: string) => setReportTarget(name), []);
  const closeReport = useCallback(() => setReportTarget(null), []);

  // After a report, refresh the detail panel by re-triggering
  const handleReported = useCallback(() => {
    tick();
  }, [tick]);

  // Escape key handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (reportTarget) closeReport();
      else if (filterPanelOpen) closeFilterPanel();
      else if (selectedVenue) closeDetail();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [reportTarget, filterPanelOpen, selectedVenue, closeReport, closeFilterPanel, closeDetail]);

  // Auto-refresh every 60s when no modals open
  useEffect(() => {
    const id = setInterval(() => {
      if (!reportTarget && !filterPanelOpen) {
        tick();
      }
    }, 60000);
    return () => clearInterval(id);
  }, [reportTarget, filterPanelOpen, tick]);

  const open = results.filter((x) => x.open);

  return (
    <>
      <div className="app">
        <Navbar />
        <FilterRail onOpenPanel={openFilterPanel} />
        <div className="sec">
          <h2>{filters.cat === "All" ? "Near you" : filters.cat}</h2>
          <span className="cnt">
            {open.length} open &middot;{" "}
            {new Date().toLocaleTimeString([], {
              hour: "numeric",
              minute: "2-digit",
            })}
          </span>
        </div>
        <Feed onOpenDetail={openDetail} />
        <Footer />
      </div>

      <DetailPanel
        venueName={selectedVenue}
        onClose={closeDetail}
        onReport={openReport}
      />

      <FilterPanel isOpen={filterPanelOpen} onClose={closeFilterPanel} />

      <ReportSheet
        targetName={reportTarget}
        onClose={closeReport}
        onReported={handleReported}
      />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <CityProvider>
        <FavoritesProvider>
          <ReportsProvider>
            <FilterProvider>
              <AppInner />
            </FilterProvider>
          </ReportsProvider>
        </FavoritesProvider>
      </CityProvider>
    </ThemeProvider>
  );
}
