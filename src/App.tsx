import { useMemo, useState, useCallback, useEffect } from 'react';
import { Moon, Sun, Volume2, VolumeX, ChevronLeft, ChevronRight } from 'lucide-react';
import { IncidentCard } from './components/IncidentCard';
import { RefreshTimer } from './components/RefreshTimer';
import { useIncidents } from './hooks/useIncidents';
import { useDarkMode } from './hooks/useDarkMode';
import { useAudioNotification } from './hooks/useAudioNotification';
import { IncidentMap } from './components/IncidentMap';
import { ScrollToTop } from './components/ScrollToTop';
import { BetaWarning } from './components/BetaWarning';
import { GoogleAnalytics } from './components/GoogleAnalytics';
import { BugReportButton } from './components/BugReportButton';
import { LoadingSpinner } from './components/LoadingSpinner';

const INCIDENTS_PER_PAGE = 50;

export default function App() {
  const { incidents, isLoading, isError, timeUntilRefresh, refresh, pinnedIncidents } = useIncidents();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { muted, toggleMute } = useAudioNotification();
  const [activeIncidentId, setActiveIncidentId] = useState<string>();
  const [currentPage, setCurrentPage] = useState(1);
  
  const handleIncidentClick = useCallback((id: string) => {
    setActiveIncidentId(id);
    // Track incident clicks in Google Analytics
    window.gtag?.('event', 'incident_click', {
      incident_id: id
    });
  }, []);

  // Reset to first page when incidents change
  useEffect(() => {
    setCurrentPage(1);
  }, [incidents.length]);

  const { pinnedIncidents: sortedPinnedIncidents, paginatedIncidents, totalPages } = useMemo(() => {
    const pinnedIds = new Set(pinnedIncidents.map(pin => pin.id));
    
    // Get pinned incidents
    const pinned = incidents
      .filter(incident => pinnedIds.has(incident.id))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    // Get unpinned incidents
    const unpinned = incidents
      .filter(incident => !pinnedIds.has(incident.id))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Calculate pagination
    const startIndex = (currentPage - 1) * INCIDENTS_PER_PAGE;
    const endIndex = startIndex + INCIDENTS_PER_PAGE;
    const paginatedList = unpinned.slice(startIndex, endIndex);
    const totalPages = Math.ceil(unpinned.length / INCIDENTS_PER_PAGE);

    return {
      pinnedIncidents: pinned,
      paginatedIncidents: paginatedList,
      totalPages
    };
  }, [incidents, pinnedIncidents, currentPage]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Track page changes in Google Analytics
    window.gtag?.('event', 'page_change', {
      page_number: page
    });
  }, []);

  const renderContent = useMemo(() => {
    if (isLoading) {
      return <LoadingSpinner />;
    }

    if (isError) {
      return (
        <div className="flex items-center justify-center h-[50vh]">
          <div className="text-center bg-red-50 dark:bg-red-900/30 p-8 rounded-xl max-w-md">
            <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4">Unable to load incidents</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">There was a problem connecting to the incident feed.</p>
            <button 
              onClick={refresh}
              className="px-6 py-2 bg-red-100 dark:bg-red-900/50 hover:bg-red-200 dark:hover:bg-red-900/70 text-red-700 dark:text-red-400 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    if (!sortedPinnedIncidents.length && !paginatedIncidents.length) {
      return (
        <div className="flex items-center justify-center h-[50vh]">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400">No active incidents found.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4 max-w-4xl mx-auto">
        {/* Pinned Incidents Section */}
        {sortedPinnedIncidents.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-2">
              Pinned Incidents
            </h2>
            {sortedPinnedIncidents.map(incident => {
              const pinnedInfo = pinnedIncidents.find(pin => pin.id === incident.id);
              return (
                <div 
                  key={incident.id}
                  onClick={() => handleIncidentClick(incident.id)}
                  className={`cursor-pointer transition-all ${
                    activeIncidentId === incident.id ? 'scale-[1.02] shadow-md' : ''
                  }`}
                >
                  <IncidentCard 
                    incident={incident} 
                    pinnedInfo={pinnedInfo}
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* Regular Incidents Section */}
        <div className="space-y-2">
          {sortedPinnedIncidents.length > 0 && paginatedIncidents.length > 0 && (
            <h2 className="text-lg font-semibold text-gray-600 dark:text-gray-400">
              Active Incidents
            </h2>
          )}
          {paginatedIncidents.map(incident => {
            const pinnedInfo = pinnedIncidents.find(pin => pin.id === incident.id);
            return (
              <div 
                key={incident.id}
                onClick={() => handleIncidentClick(incident.id)}
                className={`cursor-pointer transition-all ${
                  activeIncidentId === incident.id ? 'scale-[1.02] shadow-md' : ''
                }`}
              >
                <IncidentCard 
                  incident={incident} 
                  pinnedInfo={pinnedInfo}
                />
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200 dark:border-gray-700 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-blue-500 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200 dark:border-gray-700 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    );
  }, [sortedPinnedIncidents, paginatedIncidents, isLoading, isError, refresh, activeIncidentId, handleIncidentClick, pinnedIncidents, totalPages, currentPage, handlePageChange]);

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <GoogleAnalytics />
        <BetaWarning />
        
        <header className="bg-gradient-to-r from-blue-700 to-blue-900 dark:from-blue-800 dark:to-blue-950 text-white sticky top-0 z-50 shadow-xl">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img 
                  src="https://imgur.com/pxkaqfE.png" 
                  alt="VicAlert" 
                  className="h-14 w-auto object-contain"
                />
              </div>
              <div className="flex items-center gap-2 sm:gap-4">
                <button
                  onClick={toggleMute}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  title={muted ? 'Unmute notifications' : 'Mute notifications'}
                >
                  {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
                <button
                  onClick={toggleDarkMode}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <BugReportButton />
                <div className="hidden sm:block">
                  <RefreshTimer
                    timeUntilRefresh={timeUntilRefresh}
                    onRefresh={refresh}
                    isLoading={isLoading}
                  />
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-4">
          {!isLoading && !isError && incidents.length > 0 && (
            <div className="mb-6 h-[400px] relative z-0">
              <IncidentMap 
                incidents={incidents} 
                activeIncidentId={activeIncidentId}
                onMarkerClick={handleIncidentClick}
              />
            </div>
          )}
          {renderContent}
        </main>

        <ScrollToTop />
      </div>
    </div>
  );
}