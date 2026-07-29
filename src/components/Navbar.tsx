import React from 'react';
import { TargetNiche, BrandConfig, NicheModule } from '../types';
import { Bot, PhoneCall, Building2, Wrench, Sparkles, DollarSign, Settings, Upload, Palette, Home, Shield, Zap, Key, Sun, Plus, Layers, Lightbulb, LogIn, LogOut, User as UserIcon, BrainCircuit } from 'lucide-react';
import { User, loginWithGoogle, logoutUser } from '../lib/firebase';

interface NavbarProps {
  activeNiche: TargetNiche;
  setActiveNiche: (niche: TargetNiche) => void;
  nicheModules: NicheModule[];
  onOpenLiveStudio: () => void;
  onOpenConfig: () => void;
  onOpenPricing: () => void;
  onOpenImport: () => void;
  onOpenBrand: () => void;
  onOpenAddNicheModal: () => void;
  onOpenFeatureRequestModal: () => void;
  onOpenGeminiDrawer: () => void;
  brandConfig: BrandConfig;
  geminiConnected: boolean;
  currentUser: User | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeNiche,
  setActiveNiche,
  nicheModules,
  onOpenLiveStudio,
  onOpenConfig,
  onOpenPricing,
  onOpenImport,
  onOpenBrand,
  onOpenAddNicheModal,
  onOpenFeatureRequestModal,
  onOpenGeminiDrawer,
  brandConfig,
  geminiConnected,
  currentUser
}) => {
  const renderBrandIcon = () => {
    switch (brandConfig.logoIcon) {
      case 'building': return <Building2 className="w-5 h-5 text-white" />;
      case 'home': return <Home className="w-5 h-5 text-white" />;
      case 'sparkles': return <Sparkles className="w-5 h-5 text-white" />;
      case 'shield': return <Shield className="w-5 h-5 text-white" />;
      case 'zap': return <Zap className="w-5 h-5 text-white" />;
      default: return <Bot className="w-5 h-5 text-white animate-pulse" />;
    }
  };

  const getNicheIcon = (iconName: string) => {
    switch (iconName) {
      case 'wrench': return <Wrench className="w-3.5 h-3.5" />;
      case 'building': return <Building2 className="w-3.5 h-3.5" />;
      case 'home': return <Home className="w-3.5 h-3.5" />;
      case 'key': return <Key className="w-3.5 h-3.5" />;
      case 'sun': return <Sun className="w-3.5 h-3.5" />;
      default: return <Sparkles className="w-3.5 h-3.5" />;
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 text-slate-900 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Header Row */}
        <div className="flex items-center justify-between h-16 gap-4 border-b border-slate-100">
          
          {/* Logo & Brand Identity */}
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={onOpenBrand} title="Click to edit Agency Branding & White-Label">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-emerald-500 p-0.5 shadow-md shadow-indigo-500/10 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center overflow-hidden">
                {brandConfig.customLogoUrl ? (
                  <img src={brandConfig.customLogoUrl} alt={brandConfig.companyName} className="w-full h-full object-cover" />
                ) : (
                  renderBrandIcon()
                )}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900">
                  {brandConfig.companyName}
                </span>
                <span className="text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 hidden sm:flex items-center gap-1">
                  <Palette className="w-2.5 h-2.5 text-indigo-600" />
                  WHITE-LABEL
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden md:block font-medium">
                {brandConfig.tagline}
              </p>
            </div>
          </div>

          {/* Action Tools & Status */}
          <div className="flex items-center space-x-2">
            
            {/* Gemini API Status & Intelligence Assistant Drawer Button */}
            <button
              onClick={onOpenGeminiDrawer}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold transition-all shadow-sm group"
              title="Open Multi-turn Gemini AI Chatbot, Deep Underwriter, Search & Maps Grounding, Audio Transcription"
            >
              <BrainCircuit className="w-3.5 h-3.5 text-purple-200 group-hover:rotate-12 transition-transform" />
              <span className="hidden lg:inline">Gemini Intelligence</span>
            </button>

            {/* Brand Customizer Trigger Button */}
            <button
              onClick={onOpenBrand}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white border border-indigo-500 text-xs font-bold transition-all shadow-sm"
              title="Customize Agency Brand, Logo, Colors & White-Label Domain"
            >
              <Palette className="w-3.5 h-3.5 text-indigo-100" />
              <span className="hidden md:inline">Brand Customizer</span>
            </button>

            {/* Live Studio Call/SMS Simulator Button */}
            <button
              onClick={onOpenLiveStudio}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold transition-colors shadow-sm"
            >
              <PhoneCall className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">Live Voice Simulator</span>
            </button>

            {/* Import Leads / Properties */}
            <button
              onClick={onOpenImport}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium border border-slate-200 transition-colors"
              title="Upload Property Leads or Door List"
            >
              <Upload className="w-3.5 h-3.5 text-slate-500" />
              <span>Import</span>
            </button>

            {/* Feature Requests Trigger */}
            <button
              onClick={onOpenFeatureRequestModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold transition-all shadow-sm"
              title="Submit or Vote on Feature Requests for the Platform"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-600 fill-amber-500/20" />
              <span className="hidden md:inline">Feature Requests</span>
            </button>

            {/* Agent Telephony Config */}
            <button
              onClick={onOpenConfig}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
              title="Configure Voice & Telephony Prompts"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* ROI & SaaS Pricing Modal */}
            <button
              onClick={onOpenPricing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm"
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Pricing & ROI</span>
            </button>

            {/* Firebase Auth Google Sign In Button */}
            {currentUser ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                {currentUser.photoURL ? (
                  <img src={currentUser.photoURL} alt={currentUser.displayName || 'User'} className="w-7 h-7 rounded-full border border-slate-300 object-cover" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center border border-indigo-200">
                    {currentUser.displayName ? currentUser.displayName[0] : 'U'}
                  </div>
                )}
                <div className="hidden xl:block text-left">
                  <div className="text-[11px] font-bold text-slate-900 leading-none truncate max-w-[100px]">
                    {currentUser.displayName || 'Account Owner'}
                  </div>
                  <span className="text-[9px] text-emerald-600 font-bold block">
                    Cloud Synced
                  </span>
                </div>
                <button
                  onClick={logoutUser}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 text-xs transition-colors"
                  title="Sign Out of Firebase Account"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={loginWithGoogle}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold transition-all shadow-sm"
                title="Sign in with Google via Firebase Auth"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-3.5 h-3.5" alt="Google" />
                <span className="hidden md:inline">Sign In</span>
              </button>
            )}

          </div>

        </div>

        {/* Niche Pages Sub-Navigation Row */}
        <div className="flex items-center justify-between py-2 overflow-x-auto gap-2 scrollbar-none">
          <div className="flex items-center gap-1.5 min-w-max">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 mr-2 px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
              <Layers className="w-3 h-3 text-indigo-600" /> Niche Pages:
            </span>

            {nicheModules.map(mod => {
              const isActive = activeNiche === mod.id;
              return (
                <button
                  key={mod.id}
                  onClick={() => setActiveNiche(mod.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 border ${
                    isActive
                      ? mod.id === 'property_manager'
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                        : mod.id === 'wholesaler'
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                        : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-500 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {mod.pageNumber}
                  </span>
                  {getNicheIcon(mod.iconName)}
                  <span>{mod.name.split('&')[0]}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={onOpenAddNicheModal}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold transition-all whitespace-nowrap ml-2 shadow-sm"
            title="Create a new custom niche module page"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-600" />
            <span>Add Niche</span>
          </button>
        </div>

      </div>
    </header>
  );
};
