import React, { useState } from 'react';
import { BrandConfig } from '../types';
import { Palette, Bot, Building2, Home, Sparkles, Shield, Zap, X, Save, Globe, Phone, Image, Eye, Smartphone, Check, HelpCircle } from 'lucide-react';

interface BrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  brandConfig: BrandConfig;
  onSaveBrand: (newBrand: BrandConfig) => void;
}

export const BrandModal: React.FC<BrandModalProps> = ({
  isOpen,
  onClose,
  brandConfig,
  onSaveBrand
}) => {
  const [formData, setFormData] = useState<BrandConfig>(brandConfig);
  const [presetPreset, setPresetPreset] = useState<string>('custom');

  if (!isOpen) return null;

  const colorOptions = [
    { id: 'indigo', name: 'Indigo / Cyber', bg: 'bg-indigo-600', text: 'text-indigo-400', border: 'border-indigo-500' },
    { id: 'emerald', name: 'Emerald / Jade', bg: 'bg-emerald-600', text: 'text-emerald-400', border: 'border-emerald-500' },
    { id: 'violet', name: 'Violet / Royalty', bg: 'bg-violet-600', text: 'text-violet-400', border: 'border-violet-500' },
    { id: 'amber', name: 'Amber / Gold', bg: 'bg-amber-600', text: 'text-amber-400', border: 'border-amber-500' },
    { id: 'rose', name: 'Rose / Crimson', bg: 'bg-rose-600', text: 'text-rose-400', border: 'border-rose-500' },
    { id: 'cyan', name: 'Cyan / Modern', bg: 'bg-cyan-600', text: 'text-cyan-400', border: 'border-cyan-500' }
  ];

  const iconOptions = [
    { id: 'bot', label: 'AI Bot', icon: Bot },
    { id: 'building', label: 'Building', icon: Building2 },
    { id: 'home', label: 'Estate Home', icon: Home },
    { id: 'sparkles', label: 'Sparkles', icon: Sparkles },
    { id: 'shield', label: 'Shield Ops', icon: Shield },
    { id: 'zap', label: 'Fast Zap', icon: Zap }
  ];

  const applyBrandPreset = (presetKey: string) => {
    setPresetPreset(presetKey);
    if (presetKey === 'apex') {
      setFormData({
        companyName: 'Apex Real Estate AI',
        tagline: 'Premier Off-Market Acquisitions & Property Management',
        primaryColor: 'emerald',
        logoIcon: 'building',
        customDomain: 'app.apexrealestate.ai',
        agentPhoneName: 'Apex Virtual Specialist',
        whiteLabelEnabled: true,
        watermarkText: 'Powered by Apex AI OS',
        phoneDisplayNumber: '+1 (800) 888-APEX',
        smsSignature: 'Apex Acquisitions Desk'
      });
    } else if (presetKey === 'titan') {
      setFormData({
        companyName: 'Titan Property Holdings',
        tagline: 'Autonomous Tenant Maintenance & Deal Pipeline',
        primaryColor: 'violet',
        logoIcon: 'shield',
        customDomain: 'deals.titanholdings.com',
        agentPhoneName: 'Titan AI Operator',
        whiteLabelEnabled: true,
        watermarkText: 'Titan Enterprise AI',
        phoneDisplayNumber: '+1 (888) 999-TITN',
        smsSignature: 'Titan Operations Hub'
      });
    } else if (presetKey === 'blackstone') {
      setFormData({
        companyName: 'Blackstone Off-Market AI',
        tagline: 'Institutional Scale Wholesaling & Triage Engine',
        primaryColor: 'amber',
        logoIcon: 'zap',
        customDomain: 'wholesaling.blackstoneai.com',
        agentPhoneName: 'Blackstone Senior AI Agent',
        whiteLabelEnabled: true,
        watermarkText: 'Blackstone AI Operating Platform',
        phoneDisplayNumber: '+1 (855) 700-CASH',
        smsSignature: 'Blackstone Deal Desk'
      });
    } else if (presetKey === 'default') {
      setFormData({
        companyName: 'PropAI Operations Hub',
        tagline: 'Autonomous Real Estate & Operations Agents',
        primaryColor: 'indigo',
        logoIcon: 'bot',
        customDomain: 'ops.propai.io',
        agentPhoneName: 'PropAI AI Assistant',
        whiteLabelEnabled: true,
        watermarkText: 'Powered by PropAI Autonomous Engine',
        phoneDisplayNumber: '+1 (888) 593-PROP',
        smsSignature: 'Sent via PropAI Automated Desk'
      });
    }
  };

  const renderSelectedIcon = (iconId: string) => {
    switch (iconId) {
      case 'building': return <Building2 className="w-5 h-5 text-indigo-400" />;
      case 'home': return <Home className="w-5 h-5 text-indigo-400" />;
      case 'sparkles': return <Sparkles className="w-5 h-5 text-indigo-400" />;
      case 'shield': return <Shield className="w-5 h-5 text-indigo-400" />;
      case 'zap': return <Zap className="w-5 h-5 text-indigo-400" />;
      default: return <Bot className="w-5 h-5 text-indigo-400" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full p-6 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white shadow-md">
              <Palette className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Agency Brand Customizer & White-Label</h2>
              <p className="text-xs text-slate-500 font-medium">Tailor the app logo, colors, company name, caller ID, and domain for your client-facing platform</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Presets Bar */}
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">Quick Brand Presets</span>
            <span className="text-[10px] text-slate-500 font-medium">Click to instantly apply brand identity</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'default', name: 'PropAI (Default)' },
              { id: 'apex', name: 'Apex Real Estate' },
              { id: 'titan', name: 'Titan Property' },
              { id: 'blackstone', name: 'Blackstone Off-Market' }
            ].map(p => (
              <button
                key={p.id}
                onClick={() => applyBrandPreset(p.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  presetPreset === p.id
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Form Sections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Column 1: Core Identity */}
          <div className="space-y-4 text-xs">
            
            {/* Company Name & Tagline */}
            <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="font-extrabold text-slate-900 text-sm block">1. Company Identity</span>
              
              <div>
                <label className="block text-slate-700 mb-1 font-semibold">Agency / Platform Name</label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={e => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900 font-semibold focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. Apex Wholesaling AI"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-semibold">Subheader / Slogan</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={e => setFormData(prev => ({ ...prev, tagline: e.target.value }))}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900 text-xs focus:outline-none focus:border-indigo-500 font-medium"
                  placeholder="e.g. Autonomous Real Estate Operations"
                />
              </div>
            </div>

            {/* Logo Icon & Custom Image */}
            <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="font-extrabold text-slate-900 text-sm block">2. Brand Logo & Icon</span>
              
              <div className="grid grid-cols-3 gap-2">
                {iconOptions.map(ico => {
                  const IconComp = ico.icon;
                  const isSelected = formData.logoIcon === ico.id;
                  return (
                    <button
                      key={ico.id}
                      onClick={() => setFormData(prev => ({ ...prev, logoIcon: ico.id as any }))}
                      className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all text-xs font-semibold ${
                        isSelected
                          ? 'bg-indigo-100 border-indigo-400 text-indigo-900 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <IconComp className={`w-4 h-4 ${isSelected ? 'text-indigo-600' : 'text-slate-500'}`} />
                      <span>{ico.label}</span>
                    </button>
                  );
                })}
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-semibold">Custom Image Logo URL (Optional)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.customLogoUrl || ''}
                    onChange={e => setFormData(prev => ({ ...prev, customLogoUrl: e.target.value }))}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900 text-xs font-mono font-medium"
                    placeholder="https://example.com/logo.png"
                  />
                  {formData.customLogoUrl && (
                    <img src={formData.customLogoUrl} alt="Logo" className="w-9 h-9 rounded-xl object-contain bg-slate-100 border border-slate-200" />
                  )}
                </div>
              </div>
            </div>

            {/* Brand Theme Palette */}
            <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="font-extrabold text-slate-900 text-sm block">3. Primary Brand Palette</span>
              
              <div className="grid grid-cols-2 gap-2">
                {colorOptions.map(c => {
                  const isSelected = formData.primaryColor === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setFormData(prev => ({ ...prev, primaryColor: c.id as any }))}
                      className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                        isSelected
                          ? 'bg-white border-indigo-500 text-slate-900 shadow-sm'
                          : 'bg-white/80 border-slate-200 text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-3.5 h-3.5 rounded-full ${c.bg}`} />
                        <span className="text-xs font-bold">{c.name}</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 font-bold" />}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Column 2: White-Label, Telephony & Live Preview */}
          <div className="space-y-4 text-xs">
            
            {/* Caller ID & Custom Domain */}
            <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="font-extrabold text-slate-900 text-sm block">4. Telephony & White-Label Domain</span>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Caller ID Display Name</label>
                  <input
                    type="text"
                    value={formData.agentPhoneName}
                    onChange={e => setFormData(prev => ({ ...prev, agentPhoneName: e.target.value }))}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Display Phone Number</label>
                  <input
                    type="text"
                    value={formData.phoneDisplayNumber}
                    onChange={e => setFormData(prev => ({ ...prev, phoneDisplayNumber: e.target.value }))}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900 font-mono font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-semibold">White-Label Custom Domain</label>
                <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2">
                  <Globe className="w-4 h-4 text-indigo-600" />
                  <input
                    type="text"
                    value={formData.customDomain}
                    onChange={e => setFormData(prev => ({ ...prev, customDomain: e.target.value }))}
                    className="w-full bg-transparent text-slate-900 font-mono focus:outline-none font-medium"
                    placeholder="app.myagency.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-semibold">SMS Outbound Signature</label>
                <input
                  type="text"
                  value={formData.smsSignature}
                  onChange={e => setFormData(prev => ({ ...prev, smsSignature: e.target.value }))}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900 font-medium"
                />
              </div>
            </div>

            {/* Live Interactive Brand Preview Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-b from-slate-50 to-indigo-50/30 border border-indigo-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-indigo-600" /> Live Header & Call Preview
                </span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-mono text-[10px] font-bold">
                  PREVIEW MODE
                </span>
              </div>

              {/* Sample Navbar Banner */}
              <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold shadow-sm">
                    {renderSelectedIcon(formData.logoIcon)}
                  </div>
                  <div>
                    <div className="font-extrabold text-slate-900 text-sm leading-none">{formData.companyName || 'Agency Name'}</div>
                    <div className="text-[10px] text-slate-500 mt-1 font-medium">{formData.tagline || 'Slogan'}</div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {formData.customDomain}
                  </span>
                </div>
              </div>

              {/* Sample SMS Signature Card */}
              <div className="p-3 bg-white rounded-xl border border-slate-200 text-slate-800 space-y-1 shadow-sm">
                <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                  <Smartphone className="w-3 h-3 text-indigo-600" /> Sent to Property Owner
                </div>
                <div className="p-2 rounded-lg bg-slate-50 text-xs text-slate-800 font-medium border border-slate-100">
                  "Hi Robert, our acquisitions manager would love to confirm your cash offer of $210,000."
                  <div className="text-[10px] text-indigo-600 mt-1 italic font-mono font-bold">— {formData.smsSignature} ({formData.phoneDisplayNumber})</div>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Footer Controls */}
        <div className="flex justify-between items-center pt-4 border-t border-slate-200">
          <div className="text-xs text-slate-500 font-medium flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Changes reflect immediately across all client dashboards & voice simulators</span>
          </div>

          <div className="flex gap-3">
            <button onClick={onClose} className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors">
              Cancel
            </button>
            <button
              onClick={() => {
                onSaveBrand(formData);
                onClose();
              }}
              className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-2 shadow-sm transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Apply Custom Branding</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
