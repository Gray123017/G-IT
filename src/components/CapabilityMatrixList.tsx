import React, { useState, useMemo } from 'react';
import { Search, Film, Layers, Play, MessageSquare, Sparkles, Filter, ChevronRight } from 'lucide-react';
import { JARVIS_CAPABILITIES, JarvisCapability } from '../data/jarvisCapabilities';
import { playSound } from '../utils/soundEffects';

interface CapabilityMatrixProps {
  onSelectSimulation: (capability: JarvisCapability) => void;
  onAskJarvis: (prompt: string) => void;
}

export const CapabilityMatrixList: React.FC<CapabilityMatrixProps> = ({
  onSelectSimulation,
  onAskJarvis,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilm, setSelectedFilm] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const films = ['All', 'Iron Man (2008)', 'Iron Man 2 (2010)', 'The Avengers (2012)', 'Iron Man 3 (2013)', 'Avengers: Age of Ultron (2015)'];
  const categories = [
    'All',
    'Avionics & Flight',
    'Combat & Targeting',
    'Engineering & CAD',
    'Biometrics & Health',
    'Cyber & Hacking',
    'Protocols & AI Swarm',
    'Home & Habitat',
  ];

  const filteredCapabilities = useMemo(() => {
    return JARVIS_CAPABILITIES.filter((cap) => {
      const matchesFilm = selectedFilm === 'All' || cap.film === selectedFilm;
      const matchesCategory = selectedCategory === 'All' || cap.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        cap.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cap.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cap.movieQuote.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cap.details.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesFilm && matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedFilm, selectedCategory]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 bg-gradient-to-r from-[#061220] via-[#091a2e] to-[#061220] border border-cyan-500/40 rounded-xl shadow-[0_0_30px_rgba(0,240,255,0.15)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-tech uppercase tracking-widest text-cyan-400">
              MCU ARCHIVAL DATABASE // STARK INDUSTRIES INTEL
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-wide glow-cyan">
            Every J.A.R.V.I.S. Capability in the Movies
          </h2>
          <p className="text-xs sm:text-sm text-cyan-200/80 font-sans mt-1 max-w-2xl">
            A comprehensive catalog of every subsystem, algorithm, forensic scan, combat maneuver, and autonomous protocol executed by J.A.R.V.I.S. across the Marvel Cinematic Universe films.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-cyan-950/50 border border-cyan-500/30 px-4 py-2.5 rounded-lg flex-shrink-0">
          <div className="text-right">
            <span className="text-[10px] font-tech uppercase text-cyan-400/80 block">Total Capabilities</span>
            <span className="text-2xl font-bold font-tech text-white leading-none">
              {JARVIS_CAPABILITIES.length}
            </span>
          </div>
          <div className="h-8 w-px bg-cyan-500/30" />
          <div className="text-right">
            <span className="text-[10px] font-tech uppercase text-cyan-400/80 block">Films Spanned</span>
            <span className="text-2xl font-bold font-tech text-cyan-300 leading-none">5</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-3 bg-[#06101c]/90 border border-cyan-500/25 p-4 rounded-xl">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400/70" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search capabilities (e.g. 'icing', 'house party', 'palladium', 'tesseract', 'expo')..."
              className="w-full bg-[#081525] border border-cyan-500/30 focus:border-cyan-400 rounded-lg pl-10 pr-4 py-2 text-xs sm:text-sm font-sans text-cyan-100 placeholder:text-cyan-500/50 outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-cyan-400 hover:text-white font-tech"
              >
                CLEAR
              </button>
            )}
          </div>
        </div>

        {/* Film Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-tech scrollbar-none">
          <span className="text-cyan-400/60 uppercase tracking-wider text-[11px] pr-2 flex items-center gap-1 flex-shrink-0">
            <Film className="w-3.5 h-3.5" /> Movie:
          </span>
          {films.map((film) => (
            <button
              key={film}
              onClick={() => {
                playSound.click();
                setSelectedFilm(film);
              }}
              className={`px-3 py-1 rounded-md transition-colors whitespace-nowrap text-xs ${
                selectedFilm === film
                  ? 'bg-cyan-500/30 border border-cyan-400 text-white shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                  : 'bg-[#081525] border border-cyan-500/20 text-cyan-300/70 hover:text-cyan-100 hover:border-cyan-400/40'
              }`}
            >
              {film}
            </button>
          ))}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-tech scrollbar-none">
          <span className="text-cyan-400/60 uppercase tracking-wider text-[11px] pr-2 flex items-center gap-1 flex-shrink-0">
            <Layers className="w-3.5 h-3.5" /> Subsystem:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                playSound.click();
                setSelectedCategory(cat);
              }}
              className={`px-2.5 py-1 rounded-full transition-colors whitespace-nowrap text-[11px] ${
                selectedCategory === cat
                  ? 'bg-amber-500/25 border border-amber-400 text-amber-200 shadow-[0_0_10px_rgba(255,190,11,0.25)]'
                  : 'bg-[#081525] border border-cyan-500/20 text-cyan-300/60 hover:text-cyan-100 hover:border-cyan-400/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs font-tech text-cyan-400/80 px-1">
        <span>
          SHOWING {filteredCapabilities.length} OF {JARVIS_CAPABILITIES.length} CAPABILITIES
        </span>
        {(selectedFilm !== 'All' || selectedCategory !== 'All' || searchQuery) && (
          <button
            onClick={() => {
              setSelectedFilm('All');
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="text-cyan-400 hover:underline"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Capabilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCapabilities.map((cap) => (
          <div
            key={cap.id}
            className="bg-[#060f1b]/95 border border-cyan-500/30 hover:border-cyan-400/80 rounded-xl p-4 sm:p-5 transition-all duration-200 hover:shadow-[0_0_25px_rgba(0,240,255,0.2)] flex flex-col justify-between group"
          >
            <div className="space-y-3">
              {/* Header tags */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-tech text-cyan-400 uppercase tracking-widest flex items-center gap-1">
                  <Film className="w-3 h-3" /> {cap.film}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${cap.badgeColor} font-tech uppercase`}>
                  {cap.category}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-display font-bold text-base sm:text-lg text-white group-hover:text-cyan-200 transition-colors">
                {cap.name}
              </h3>

              {/* Description */}
              <p className="text-xs sm:text-sm text-cyan-100/80 leading-relaxed font-sans">
                {cap.description}
              </p>

              {/* Movie Quote Callout */}
              <div className="p-2.5 bg-[#091829] border-l-2 border-cyan-400 rounded-r text-xs font-tech text-cyan-200/90 italic">
                {cap.movieQuote}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 mt-4 border-t border-cyan-500/20 flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  playSound.click();
                  onAskJarvis(`Explain how you perform ${cap.name} in ${cap.film}. What are the mathematical algorithms, sensors, and hardware you deploy?`);
                }}
                className="text-xs font-tech text-cyan-400 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" /> Discuss with J.A.R.V.I.S.
              </button>

              <button
                onClick={() => {
                  playSound.click();
                  onSelectSimulation(cap);
                }}
                className="px-3.5 py-1.5 bg-cyan-950/80 hover:bg-cyan-500 hover:text-black border border-cyan-400/50 hover:border-cyan-300 text-cyan-300 text-xs font-tech uppercase font-bold rounded-lg transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,240,255,0.2)]"
              >
                <Play className="w-3 h-3 fill-current" /> Run Simulation
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredCapabilities.length === 0 && (
        <div className="text-center py-12 p-6 bg-[#06101c] border border-cyan-500/20 rounded-xl">
          <Filter className="w-8 h-8 text-cyan-500/40 mx-auto mb-2" />
          <h4 className="font-display font-bold text-white text-base">No Matching Capabilities Found</h4>
          <p className="text-xs text-cyan-300/70 font-sans mt-1">
            Try adjusting your search query or selecting a different film/category filter.
          </p>
        </div>
      )}
    </div>
  );
};
