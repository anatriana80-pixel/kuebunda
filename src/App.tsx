/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import { 
  LogIn, User, ShieldCheck, ChevronRight, ShoppingBag, Heart, Globe, 
  LayoutDashboard, Store, Cake, ClipboardList, BarChart3, LogOut,
  Plus, Edit2, Trash2, Search, Filter, Download, Calendar, TrendingUp,
  MoreVertical, CheckCircle2, AlertCircle, Clock, Save, FileSpreadsheet
} from 'lucide-react';

const CAKE_IMAGES = [
  'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=1920',
  'https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&q=80&w=1920',
  'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&q=80&w=1920',
  'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&q=80&w=1920',
  'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&q=80&w=1920',
];

type ViewState = 'welcome' | 'login-form' | 'dashboard';
type DashboardTab = 'overview' | 'pelanggan' | 'kue' | 'titipan' | 'laporan';

interface Pelanggan {
  id: string;
  nama: string;
  alamat: string;
  kontak: string;
}

interface Kue {
  id: string;
  nama: string;
  harga: number;
  kategori: string;
}

interface Titipan {
  id: string;
  kueId: string;
  pelangganId: string;
  jumlah: number;
  terjual: number;
  retur: number;
  status: 'pending' | 'proses' | 'selesai';
  tanggal: string;
}

export default function App() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [view, setView] = useState<ViewState>('welcome');
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Mock Data State
  const [pelanggans, setPelanggans] = useState<Pelanggan[]>([
    { id: '1', nama: 'Rumah Klapy', alamat: '-', kontak: '-' },
  ]);
  const [kues, setKues] = useState<Kue[]>([
    { id: '1', nama: 'CALA ISI', harga: 2500, kategori: 'Kue' },
    { id: '2', nama: 'KATRISOLO', harga: 2500, kategori: 'Kue' },
    { id: '3', nama: 'ZEBRA', harga: 2000, kategori: 'Kue' },
    { id: '4', nama: 'GABIN KUKUS', harga: 2500, kategori: 'Kue' },
    { id: '5', nama: 'BALAPIS', harga: 2500, kategori: 'Kue' },
    { id: '6', nama: 'COKLAT KRISPY', harga: 2500, kategori: 'Kue' },
    { id: '7', nama: 'LUMPUR IJO', harga: 2500, kategori: 'Kue' },
    { id: '8', nama: 'DADARA', harga: 2500, kategori: 'Kue' },
    { id: '9', nama: 'NAGASARI BANDUNG', harga: 2000, kategori: 'Kue' },
    { id: '10', nama: 'APANG COLO', harga: 2000, kategori: 'Kue' },
    { id: '11', nama: 'PUDING ASTOR', harga: 2500, kategori: 'Kue' },
    { id: '12', nama: 'ANGKA', harga: 2500, kategori: 'Kue' },
    { id: '13', nama: 'RISOLES', harga: 3000, kategori: 'Kue' },
  ]);
  const [titipans, setTitipans] = useState<Titipan[]>([
    { id: '1', kueId: '1', pelangganId: '1', jumlah: 30, terjual: 25, retur: 5, status: 'selesai', tanggal: '2024-03-20' },
    { id: '2', kueId: '2', pelangganId: '2', jumlah: 20, terjual: 20, retur: 0, status: 'proses', tanggal: '2024-03-21' },
  ]);

  // Background image rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % CAKE_IMAGES.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      setView('dashboard');
      setError('');
    } else {
      setError('Username atau password salah');
    }
  };

  const handleLogout = () => {
    setView('welcome');
    setUsername('');
    setPassword('');
    setActiveTab('overview');
  };

  const [showModal, setShowModal] = useState<{ type: 'pelanggan' | 'kue' | 'titipan', mode: 'add' | 'edit', data?: any } | null>(null);

  // CRUD Handlers
  const handleAddPelanggan = (nama: string, alamat: string) => {
    setPelanggans([...pelanggans, { id: Date.now().toString(), nama, alamat, kontak: '-' }]);
    setShowModal(null);
  };

  const handleDeletePelanggan = (id: string) => {
    setPelanggans(pelanggans.filter(p => p.id !== id));
  };

  const handleAddKue = (nama: string, harga: number) => {
    setKues([...kues, { id: Date.now().toString(), nama, harga, kategori: 'General' }]);
    setShowModal(null);
  };

  const handleEditKue = (id: string, nama: string, harga: number) => {
    setKues(kues.map(k => k.id === id ? { ...k, nama, harga } : k));
    setShowModal(null);
  };

  const handleDeleteKue = (id: string) => {
    setKues(kues.filter(k => k.id !== id));
  };

  const handleAddTitipan = (pelangganId: string, jumlah: number, kueId: string) => {
    setTitipans([...titipans, { 
      id: Date.now().toString(), 
      kueId, 
      pelangganId, 
      jumlah, 
      terjual: jumlah,
      retur: 0,
      status: 'pending', 
      tanggal: new Date().toISOString().split('T')[0] 
    }]);
    setShowModal(null);
  };

  const handleUpdateTitipan = (id: string, updates: Partial<Titipan>) => {
    setTitipans(titipans.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const updateTitipanStatus = (id: string, status: 'pending' | 'proses' | 'selesai') => {
    setTitipans(titipans.map(t => t.id === id ? { ...t, status } : t));
  };

  const deleteTitipan = (id: string) => {
    setTitipans(titipans.filter(t => t.id !== id));
  };

  return (
    <div className="min-h-screen w-full bg-[#FFFBF7] font-sans text-stone-900 overflow-x-hidden">
      <AnimatePresence mode="wait">
        {view === 'welcome' && (
          <WelcomeScreen onStart={() => setView('login-form')} currentImageIndex={currentImageIndex} />
        )}

        {view === 'login-form' && (
          <LoginScreen 
            username={username}
            password={password}
            error={error}
            onUsernameChange={setUsername}
            onPasswordChange={setPassword}
            onLogin={handleLogin}
            onBack={() => setView('welcome')}
            currentImageIndex={currentImageIndex}
          />
        )}

        {view === 'dashboard' && (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-screen w-full overflow-hidden"
          >
            <DashboardLayout 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              onLogout={handleLogout}
            >
              <DashboardContent 
                activeTab={activeTab}
                pelanggans={pelanggans}
                kues={kues}
                titipans={titipans}
                addPelanggan={() => setShowModal({ type: 'pelanggan', mode: 'add' })}
                deletePelanggan={handleDeletePelanggan}
                addKue={() => setShowModal({ type: 'kue', mode: 'add' })}
                editKue={(id: string) => setShowModal({ type: 'kue', mode: 'edit', data: kues.find(k => k.id === id) })}
                deleteKue={handleDeleteKue}
                addTitipan={() => setShowModal({ type: 'titipan', mode: 'add' })}
                handleUpdateTitipan={handleUpdateTitipan}
                updateTitipanStatus={updateTitipanStatus}
                deleteTitipan={deleteTitipan}
              />
            </DashboardLayout>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CRUD Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-900/60 backdrop-blur-md p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-[3rem] w-full max-w-md p-10 shadow-[0_32px_64px_-15px_rgba(0,0,0,0.5)] border border-stone-100"
          >
            <div className="mb-8">
              <h3 className="text-3xl font-serif font-black text-stone-900 capitalize tracking-tight">{showModal.mode} {showModal.type}</h3>
              <p className="text-stone-400 text-sm font-medium mt-1">Lengkapi detail informasi di bawah ini</p>
            </div>

            <form onSubmit={(e: any) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              if (showModal.type === 'pelanggan') {
                handleAddPelanggan(formData.get('nama') as string, formData.get('alamat') as string);
              } else if (showModal.type === 'kue') {
                if (showModal.mode === 'add') {
                  handleAddKue(formData.get('nama') as string, Number(formData.get('harga')));
                } else {
                  handleEditKue(showModal.data.id, formData.get('nama') as string, Number(formData.get('harga')));
                }
              } else if (showModal.type === 'titipan') {
                handleAddTitipan(formData.get('pelangganId') as string, Number(formData.get('jumlah')), formData.get('kueId') as string);
              }
            }} className="space-y-6">
              {showModal.type === 'pelanggan' && (
                <>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 ml-1">Nama Pelanggan</label>
                    <input name="nama" placeholder="Contoh: Bunda Sarah" required className="w-full p-5 rounded-2xl bg-stone-50 border-2 border-stone-100 outline-none focus:border-rose-500 focus:bg-white transition-all font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 ml-1">Alamat Pengiriman</label>
                    <input name="alamat" placeholder="Contoh: Jakarta Selatan" required className="w-full p-5 rounded-2xl bg-stone-50 border-2 border-stone-100 outline-none focus:border-rose-500 focus:bg-white transition-all font-bold" />
                  </div>
                </>
              )}
              {showModal.type === 'kue' && (
                <>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 ml-1">Nama Produk</label>
                    <input name="nama" defaultValue={showModal.data?.nama} placeholder="Contoh: Croissant Supreme" required className="w-full p-5 rounded-2xl bg-stone-50 border-2 border-stone-100 outline-none focus:border-rose-500 focus:bg-white transition-all font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 ml-1">Harga Satuan (Rp.)</label>
                    <input name="harga" type="number" defaultValue={showModal.data?.harga} placeholder="0" required className="w-full p-5 rounded-2xl bg-stone-50 border-2 border-stone-100 outline-none focus:border-rose-500 focus:bg-white transition-all font-bold" />
                  </div>
                </>
              )}
              {showModal.type === 'titipan' && (
                <>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 ml-1">Pilih Pelanggan</label>
                    <select name="pelangganId" className="w-full p-5 rounded-2xl bg-stone-50 border-2 border-stone-100 outline-none focus:border-rose-500 focus:bg-white transition-all font-bold appearance-none">
                      {pelanggans.map((p: any) => <option key={p.id} value={p.id}>{p.nama}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 ml-1">Jumlah Pesanan</label>
                    <input name="jumlah" type="number" placeholder="0" required className="w-full p-5 rounded-2xl bg-stone-50 border-2 border-stone-100 outline-none focus:border-rose-500 focus:bg-white transition-all font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 ml-1">Pilih Produk</label>
                    <select name="kueId" className="w-full p-5 rounded-2xl bg-stone-50 border-2 border-stone-100 outline-none focus:border-rose-500 focus:bg-white transition-all font-bold appearance-none">
                      {kues.map((k: any) => <option key={k.id} value={k.id}>{k.nama}</option>)}
                    </select>
                  </div>
                </>
              )}
              <div className="flex gap-4 pt-6">
                <button type="button" onClick={() => setShowModal(null)} className="flex-1 py-5 rounded-2xl font-black text-stone-400 hover:bg-stone-50 transition-all uppercase tracking-widest text-xs">Batal</button>
                <button type="submit" className="food-gradient flex-1 py-5 rounded-2xl font-black text-white shadow-xl shadow-rose-200 hover:scale-[1.02] transition-all active:scale-95 uppercase tracking-widest text-xs">Simpan</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Footer Branding - Only show on non-dashboard views */}
      {view !== 'dashboard' && (
        <div className="pointer-events-none absolute bottom-12 left-0 right-0 z-30 flex justify-center">
          <div className="pointer-events-auto flex items-center gap-3 rounded-full bg-black/40 px-6 py-3 backdrop-blur-xl border border-white/10 shadow-2xl">
            <div className="h-2.5 w-2.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
            <span className="text-[10px] font-black tracking-[0.3em] text-white uppercase">Premium Personal Shopper Service</span>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Sub-components ---

function WelcomeScreen({ onStart, currentImageIndex }: { onStart: () => void, currentImageIndex: number }) {
  return (
    <motion.div 
      key="welcome"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative h-screen w-full overflow-hidden"
    >
      <BackgroundImage index={currentImageIndex} />
      <div className="relative z-50 flex h-full flex-col items-center justify-center px-6 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur-md border border-white/30">
            <Globe className="h-4 w-4 text-amber-300" />
            <span className="text-xs font-bold tracking-widest text-white uppercase">Cita Rasa Dunia</span>
          </div>
          <h1 className="mb-4 font-serif text-6xl font-black text-white md:text-9xl tracking-tighter leading-none">
            KUE <span className="italic text-amber-400 drop-shadow-lg">BUNDA</span>
          </h1>
          <p className="mb-12 text-xl text-white/90 md:text-2xl font-medium leading-relaxed max-w-xl mx-auto">
            Kelezatan kue-kue legendaris dunia, <span className="text-amber-300 font-bold">hangat</span> sampai ke tangan Anda.
          </p>
          <button
            onClick={onStart}
            className="group relative mx-auto flex items-center justify-center gap-4 overflow-hidden rounded-full bg-white px-10 py-5 text-xl font-black text-rose-700 transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-rose-900/40"
          >
            Mulai Petualangan Rasa
            <ChevronRight className="h-6 w-6 transition-transform group-hover:translate-x-2" />
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}

function LoginScreen({ username, password, error, onUsernameChange, onPasswordChange, onLogin, onBack, currentImageIndex }: any) {
  return (
    <motion.div 
      key="login"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative h-screen w-full overflow-hidden flex items-center justify-center"
    >
      <BackgroundImage index={currentImageIndex} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-50 w-full max-w-md overflow-hidden rounded-[3rem] bg-white/95 backdrop-blur-xl shadow-[0_32px_64px_-15px_rgba(0,0,0,0.3)] p-12 border border-white/20"
      >
        <div className="mb-10 text-center">
          <button onClick={onBack} className="mb-8 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-stone-400 hover:text-rose-600 transition-colors mx-auto">
            <ChevronRight className="h-3 w-3 rotate-180" /> Kembali
          </button>
          <h2 className="text-4xl font-serif font-black text-stone-900 mb-2">Selamat Datang</h2>
          <p className="text-stone-500 font-medium">Masuk untuk mengelola pesanan lezat Anda</p>
        </div>

        <form className="space-y-8 text-left" onSubmit={onLogin}>
          {error && <div className="p-4 rounded-2xl bg-rose-50 text-rose-700 text-sm font-bold flex items-center gap-3 border border-rose-100"><AlertCircle className="h-5 w-5" /> {error}</div>}
          <div className="space-y-2">
            <label className="block text-xs font-black uppercase tracking-[0.2em] text-stone-500 ml-1">Username</label>
            <div className="relative group">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400 group-focus-within:text-rose-500 transition-colors" />
              <input
                type="text"
                value={username}
                onChange={(e) => onUsernameChange(e.target.value)}
                placeholder="admin"
                className="w-full rounded-[1.5rem] border-2 border-stone-100 bg-stone-50/50 py-5 pl-14 pr-6 outline-none focus:border-rose-500 focus:bg-white focus:ring-8 focus:ring-rose-500/5 transition-all text-lg font-medium"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-black uppercase tracking-[0.2em] text-stone-500 ml-1">Password</label>
            <div className="relative group">
              <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400 group-focus-within:text-rose-500 transition-colors" />
              <input
                type="password"
                value={password}
                onChange={(e) => onPasswordChange(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-[1.5rem] border-2 border-stone-100 bg-stone-50/50 py-5 pl-14 pr-6 outline-none focus:border-rose-500 focus:bg-white focus:ring-8 focus:ring-rose-500/5 transition-all text-lg font-medium"
              />
            </div>
          </div>
          <button type="submit" className="food-gradient w-full rounded-[1.5rem] py-5 font-black text-white text-lg shadow-2xl shadow-rose-200 hover:scale-[1.02] transition-all active:scale-95 mt-4">
            Masuk Sekarang
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

function BackgroundImage({ index }: { index: number }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={index}
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 bg-black/50 z-10" />
        <img src={CAKE_IMAGES[index]} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
      </motion.div>
    </AnimatePresence>
  );
}

function DashboardLayout({ children, activeTab, setActiveTab, onLogout }: any) {
  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pelanggan', label: 'Toko Mitra', icon: Store },
    { id: 'kue', label: 'Produk Kue', icon: Cake },
    { id: 'titipan', label: 'Titipan Kue', icon: ClipboardList },
    { id: 'laporan', label: 'Laporan Penjualan', icon: BarChart3 },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#FFFBF7]">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-stone-100 flex flex-col shadow-2xl z-40">
        <div className="p-10">
          <h1 className="font-serif text-3xl font-black text-rose-700 tracking-tighter leading-none">
            KUE <span className="italic text-amber-500">BUNDA</span>
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-300 mt-2">Cake Maker System</p>
        </div>
        <nav className="flex-1 px-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as DashboardTab)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-[1.25rem] text-sm font-black transition-all ${
                activeTab === item.id 
                ? 'bg-rose-600 text-white shadow-xl shadow-rose-200 scale-[1.02]' 
                : 'text-stone-400 hover:bg-stone-50 hover:text-stone-900'
              }`}
            >
              <item.icon className={`h-5 w-5 ${activeTab === item.id ? 'text-white' : 'text-stone-300'}`} />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-8 border-t border-stone-50">
          <button onClick={onLogout} className="w-full flex items-center gap-4 px-5 py-4 rounded-[1.25rem] text-sm font-black text-rose-600 hover:bg-rose-50 transition-all">
            <LogOut className="h-5 w-5" /> Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-24 bg-white/80 backdrop-blur-md border-b border-stone-100 flex items-center justify-between px-12 sticky top-0 z-30">
          <h2 className="font-serif text-2xl font-black text-stone-900 capitalize tracking-tight">
            {menuItems.find(m => m.id === activeTab)?.label || activeTab}
          </h2>
          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-stone-900">Bunda</p>
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Owner & Baker</p>
            </div>
            <div className="h-12 w-12 rounded-2xl food-gradient flex items-center justify-center text-white font-black text-xl shadow-lg shadow-rose-200">B</div>
          </div>
        </header>
        <div className="p-12 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

function DashboardContent({ activeTab, pelanggans, kues, titipans, addPelanggan, deletePelanggan, addKue, editKue, deleteKue, addTitipan, handleUpdateTitipan, deleteTitipan }: any) {
  switch (activeTab) {
    case 'overview': return <OverviewTab pelanggans={pelanggans} kues={kues} titipans={titipans} />;
    case 'pelanggan': return <PelangganTab pelanggans={pelanggans} addPelanggan={addPelanggan} deletePelanggan={deletePelanggan} />;
    case 'kue': return <KueTab kues={kues} addKue={addKue} editKue={editKue} deleteKue={deleteKue} />;
    case 'titipan': return <TitipanTab titipans={titipans} kues={kues} pelanggans={pelanggans} addTitipan={addTitipan} handleUpdateTitipan={handleUpdateTitipan} deleteTitipan={deleteTitipan} />;
    case 'laporan': return <LaporanTab titipans={titipans} pelanggans={pelanggans} kues={kues} />;
    default: return null;
  }
}

function OverviewTab({ pelanggans, kues, titipans }: any) {
  const stats = useMemo(() => {
    const totalPendapatan = titipans.reduce((acc: number, t: any) => {
      const kue = kues.find((k: any) => k.id === t.kueId);
      return acc + ((t.terjual || 0) * (kue?.harga || 0));
    }, 0);

    return [
      { label: 'Toko Mitra', value: pelanggans.length, icon: Store, color: 'from-rose-500 to-rose-600' },
      { label: 'Varian Kue', value: kues.length, icon: Cake, color: 'from-amber-500 to-amber-600' },
      { label: 'Titipan Aktif', value: titipans.filter((t: any) => t.status !== 'selesai').length, icon: ClipboardList, color: 'from-orange-500 to-orange-600' },
      { label: 'Total Omzet', value: `Rp. ${(totalPendapatan / 1000000).toFixed(1)}jt`, icon: TrendingUp, color: 'from-emerald-500 to-emerald-600' },
    ];
  }, [pelanggans, kues, titipans]);

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-xl shadow-stone-200/40 group hover:scale-[1.02] transition-all">
            <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg shadow-stone-200 mb-6`}>
              <stat.icon className="h-7 w-7" />
            </div>
            <p className="text-stone-400 text-[10px] font-black uppercase tracking-[0.2em]">{stat.label}</p>
            <h3 className="text-3xl font-black mt-2 text-stone-900 tracking-tight whitespace-nowrap">{stat.value}</h3>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="bg-white p-10 rounded-[3rem] border border-stone-100 shadow-xl shadow-stone-200/40">
          <h3 className="font-serif text-2xl font-black mb-8 text-stone-900">Distribusi Terakhir</h3>
          <div className="space-y-8">
            {titipans.slice(0, 5).map((t: any) => (
              <div key={t.id} className="flex items-center gap-6 group">
                <div className="h-14 w-14 rounded-2xl bg-stone-50 flex items-center justify-center text-stone-300 group-hover:text-rose-500 group-hover:bg-rose-50 transition-all"><Clock className="h-6 w-6" /></div>
                <div>
                  <p className="text-base font-black text-stone-900">Titipan: {kues.find((k: any) => k.id === t.kueId)?.nama}</p>
                  <p className="text-sm text-stone-400 font-medium">{t.tanggal} • {pelanggans.find((p: any) => p.id === t.pelangganId)?.nama || 'Unknown'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PelangganTab({ pelanggans, addPelanggan, deletePelanggan }: any) {
  return (
    <div className="bg-white rounded-[3rem] border border-stone-100 shadow-2xl shadow-stone-200/40 overflow-hidden">
      <div className="p-10 border-b border-stone-50 flex items-center justify-between bg-gradient-to-r from-white to-stone-50/50">
        <div>
          <h3 className="font-serif text-3xl font-black text-stone-900">Daftar Mitra</h3>
          <p className="text-stone-400 text-sm font-medium mt-1">Kelola data toko tempat penitipan kue Anda</p>
        </div>
        <button onClick={addPelanggan} className="food-gradient flex items-center gap-3 text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl shadow-rose-200 hover:scale-105 transition-all active:scale-95">
          <Plus className="h-5 w-5" /> Tambah Toko
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-stone-50/50 text-stone-400 text-[10px] font-black uppercase tracking-[0.25em] border-b border-stone-100">
            <tr>
              <th className="px-10 py-6">Nama Toko</th>
              <th className="px-10 py-6">Alamat</th>
              <th className="px-10 py-6">Kontak</th>
              <th className="px-10 py-6 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {pelanggans.map((p: any) => (
              <tr key={p.id} className="hover:bg-amber-50/30 transition-all group">
                <td className="px-10 py-7 font-black text-stone-900 text-lg tracking-tight">{p.nama}</td>
                <td className="px-10 py-7 text-stone-500 font-medium">{p.alamat}</td>
                <td className="px-10 py-7">
                  <span className="px-4 py-1.5 bg-stone-100 text-stone-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-stone-200">
                    {p.kontak}
                  </span>
                </td>
                <td className="px-10 py-7 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <button className="p-3 text-stone-300 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all"><Edit2 className="h-5 w-5" /></button>
                    <button onClick={() => deletePelanggan(p.id)} className="p-3 text-stone-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"><Trash2 className="h-5 w-5" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function KueTab({ kues, addKue, editKue, deleteKue }: any) {
  return (
    <div className="bg-white rounded-[3rem] border border-stone-100 shadow-2xl shadow-stone-200/40 overflow-hidden">
      <div className="p-10 border-b border-stone-50 flex items-center justify-between bg-gradient-to-r from-white to-stone-50/50">
        <div>
          <h3 className="font-serif text-3xl font-black text-stone-900">Katalog Kue Premium</h3>
          <p className="text-stone-400 text-sm font-medium mt-1">Koleksi cita rasa terbaik untuk pelanggan setia</p>
        </div>
        <button onClick={addKue} className="food-gradient flex items-center gap-3 text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl shadow-rose-200 hover:scale-105 transition-all active:scale-95">
          <Plus className="h-5 w-5" /> Tambah Kue
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-stone-50/50 text-stone-400 text-[10px] font-black uppercase tracking-[0.25em] border-b border-stone-100">
            <tr>
              <th className="px-10 py-6">Nama Kue</th>
              <th className="px-10 py-6">Harga</th>
              <th className="px-10 py-6">Kategori</th>
              <th className="px-10 py-6 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {kues.map((kue: any) => (
              <tr key={kue.id} className="hover:bg-rose-50/30 transition-all group">
                <td className="px-10 py-7 font-black text-stone-900 text-lg tracking-tight">{kue.nama}</td>
                <td className="px-10 py-7 font-black text-rose-600 text-xl tracking-tighter whitespace-nowrap">Rp. {kue.harga.toLocaleString()}</td>
                <td className="px-10 py-7">
                  <span className="px-4 py-1.5 bg-amber-50 text-amber-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-100">
                    {kue.kategori}
                  </span>
                </td>
                <td className="px-10 py-7 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <button onClick={() => editKue(kue.id)} className="p-3 text-stone-300 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all"><Edit2 className="h-5 w-5" /></button>
                    <button onClick={() => deleteKue(kue.id)} className="p-3 text-stone-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"><Trash2 className="h-5 w-5" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TitipanTab({ titipans, kues, pelanggans, addTitipan, handleUpdateTitipan, deleteTitipan }: any) {
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterPelanggan, setFilterPelanggan] = useState('all');

  const filteredTitipans = useMemo(() => {
    return titipans.filter((t: any) => {
      const matchDate = !filterDate || t.tanggal === filterDate;
      const matchPelanggan = filterPelanggan === 'all' || t.pelangganId === filterPelanggan;
      return matchDate && matchPelanggan;
    });
  }, [titipans, filterDate, filterPelanggan]);

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h3 className="font-serif text-4xl font-black text-stone-900 tracking-tight">Titipan Kue</h3>
          <p className="text-stone-400 text-base font-medium mt-2">Pantau stok dan penjualan kue di toko mitra</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative group">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400 group-focus-within:text-rose-500 transition-colors" />
            <input 
              type="date" 
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="pl-12 pr-6 py-4 rounded-2xl border-2 border-stone-100 bg-white text-sm font-black outline-none focus:border-rose-500 focus:ring-8 focus:ring-rose-500/5 transition-all"
            />
          </div>
          
          <select 
            value={filterPelanggan}
            onChange={(e) => setFilterPelanggan(e.target.value)}
            className="px-6 py-4 rounded-2xl border-2 border-stone-100 bg-white text-sm font-black outline-none focus:border-rose-500 focus:ring-8 focus:ring-rose-500/5 transition-all min-w-[200px] appearance-none"
          >
            <option value="all">Semua Toko Mitra</option>
            {pelanggans.map((p: any) => <option key={p.id} value={p.id}>{p.nama}</option>)}
          </select>

          <button 
            onClick={addTitipan}
            className="food-gradient flex items-center gap-3 text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl shadow-rose-200 hover:scale-105 transition-all active:scale-95"
          >
            <Plus className="h-5 w-5" /> Catat Titipan Baru
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-stone-100 shadow-2xl shadow-stone-200/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-stone-50/50 text-stone-400 text-[10px] font-black uppercase tracking-[0.25em] border-b border-stone-100">
              <tr>
                <th className="px-10 py-6">Toko Mitra</th>
                <th className="px-10 py-6">Nama Kue</th>
                <th className="px-8 py-6 text-center">Jumlah</th>
                <th className="px-8 py-6">Harga</th>
                <th className="px-8 py-6 text-center">Terjual</th>
                <th className="px-8 py-6 text-center">Retur</th>
                <th className="px-10 py-6 text-right">Subtotal</th>
                <th className="px-10 py-6 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {filteredTitipans.map((t: any) => {
                const kue = kues.find((k: any) => k.id === t.kueId);
                const subtotal = (t.terjual || 0) * (kue?.harga || 0);
                
                return (
                  <tr key={t.id} className="group hover:bg-rose-50/30 transition-all">
                    <td className="px-10 py-7">
                      <div className="font-black text-stone-900 uppercase text-xs tracking-widest">
                        {pelanggans.find((p: any) => p.id === t.pelangganId)?.nama || 'Unknown'}
                      </div>
                    </td>
                    <td className="px-10 py-7">
                      <div className="font-black text-stone-700 uppercase text-xs tracking-tight">
                        {kue?.nama || 'Unknown'}
                      </div>
                    </td>
                    <td className="px-8 py-7 text-center font-black text-stone-400">{t.jumlah}</td>
                    <td className="px-8 py-7 font-black text-stone-400 whitespace-nowrap">
                      Rp. {(kue?.harga || 0).toLocaleString()}
                    </td>
                    <td className="px-8 py-7 text-center">
                      <div className="w-20 mx-auto py-2.5 rounded-xl border-2 border-stone-100 bg-stone-50/50 font-black text-rose-600">
                        {t.terjual}
                      </div>
                    </td>
                    <td className="px-8 py-7 text-center">
                      <input 
                        type="number"
                        value={t.retur}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => {
                          const val = e.target.value === '' ? 0 : parseInt(e.target.value);
                          const retur = Math.min(t.jumlah, Math.max(0, val));
                          handleUpdateTitipan(t.id, { 
                            retur,
                            terjual: t.jumlah - retur
                          });
                        }}
                        className="w-20 text-center py-2.5 rounded-xl border-2 border-stone-100 bg-white shadow-sm font-black text-stone-600 outline-none focus:border-rose-500 transition-all"
                      />
                    </td>
                    <td className="px-10 py-7 text-right font-black text-stone-900 text-lg tracking-tighter whitespace-nowrap">
                      Rp. {subtotal.toLocaleString()}
                    </td>
                    <td className="px-10 py-7">
                      <div className="flex items-center justify-center gap-3">
                        <button className="p-3 text-stone-300 hover:text-rose-600 transition-all rounded-xl hover:bg-rose-50">
                          <Save className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => deleteTitipan(t.id)}
                          className="p-3 text-stone-300 hover:text-rose-600 transition-all rounded-xl hover:bg-rose-50"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function LaporanTab({ titipans, pelanggans, kues }: any) {
  const [filterPelanggan, setFilterPelanggan] = useState('all');
  const [filterPeriod, setFilterPeriod] = useState<'daily' | 'monthly' | 'yearly'>('daily');
  const reportRef = useRef<HTMLDivElement>(null);

  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    setIsExporting(true);
    
    try {
      // Ensure we are at the top for better capture
      window.scrollTo(0, 0);
      
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: true, // Enable logging for debugging
        backgroundColor: '#FFFBF7',
        windowWidth: reportRef.current.scrollWidth,
        windowHeight: reportRef.current.scrollHeight,
        onclone: (clonedDoc) => {
          // You can modify the cloned document here if needed
          const el = clonedDoc.querySelector('[ref="reportRef"]') as HTMLElement;
          if (el) el.style.padding = '40px';
        }
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      
      const finalWidth = imgWidth * ratio;
      const finalHeight = imgHeight * ratio;
      
      pdf.addImage(imgData, 'JPEG', (pdfWidth - finalWidth) / 2, 10, finalWidth, finalHeight);
      pdf.save(`Laporan_Penjualan_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Gagal mengekspor PDF. Pastikan browser Anda mengizinkan unduhan dan coba lagi.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportXLS = () => {
    try {
      const dataToExport = titipans.filter((t: any) => {
        const matchPelanggan = filterPelanggan === 'all' || t.pelangganId === filterPelanggan;
        const date = new Date(t.tanggal);
        const now = new Date();
        
        if (filterPeriod === 'daily') {
          return matchPelanggan && t.tanggal === now.toISOString().split('T')[0];
        } else if (filterPeriod === 'monthly') {
          return matchPelanggan && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
        } else {
          return matchPelanggan && date.getFullYear() === now.getFullYear();
        }
      }).map((t: any) => {
        const pelanggan = pelanggans.find((p: any) => p.id === t.pelangganId);
        const kue = kues.find((k: any) => k.id === t.kueId);
        return {
          Tanggal: t.tanggal,
          Pelanggan: pelanggan?.nama || 'Unknown',
          Kue: kue?.nama || 'Unknown',
          Jumlah: t.jumlah,
          Terjual: t.terjual,
          Retur: t.retur,
          'Harga Satuan': kue?.harga || 0,
          Total: (t.terjual || 0) * (kue?.harga || 0)
        };
      });

      const ws = XLSX.utils.json_to_sheet(dataToExport);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Laporan Penjualan');
      XLSX.writeFile(wb, `Laporan_Penjualan_${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (error) {
      console.error('Error generating XLS:', error);
      alert('Gagal mengekspor XLS. Silakan coba lagi.');
    }
  };

  const reportData = useMemo(() => {
    const filtered = titipans.filter((t: any) => {
      const matchPelanggan = filterPelanggan === 'all' || t.pelangganId === filterPelanggan;
      const date = new Date(t.tanggal);
      const now = new Date();
      
      if (filterPeriod === 'daily') {
        return matchPelanggan && t.tanggal === now.toISOString().split('T')[0];
      } else if (filterPeriod === 'monthly') {
        return matchPelanggan && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      } else {
        return matchPelanggan && date.getFullYear() === now.getFullYear();
      }
    });

    const totalTerjual = filtered.reduce((acc: number, t: any) => acc + (t.terjual || 0), 0);
    const totalRetur = filtered.reduce((acc: number, t: any) => acc + (t.retur || 0), 0);
    const totalPendapatan = filtered.reduce((acc: number, t: any) => {
      const kue = kues.find((k: any) => k.id === t.kueId);
      return acc + ((t.terjual || 0) * (kue?.harga || 0));
    }, 0);

    return { totalTerjual, totalRetur, totalPendapatan, count: filtered.length };
  }, [titipans, filterPelanggan, filterPeriod, kues]);

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h3 className="font-serif text-4xl font-black text-stone-900 tracking-tight">Laporan Penjualan</h3>
          <p className="text-stone-400 text-base font-medium mt-2">Analisis performa distribusi kue Anda</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <select 
            value={filterPelanggan}
            onChange={(e) => setFilterPelanggan(e.target.value)}
            className="px-6 py-4 rounded-2xl border-2 border-stone-100 bg-white text-sm font-black outline-none focus:border-rose-500 focus:ring-8 focus:ring-rose-500/5 transition-all min-w-[200px]"
          >
            <option value="all">Semua Toko/Pelanggan</option>
            {pelanggans.map((p: any) => <option key={p.id} value={p.id}>{p.nama}</option>)}
          </select>

          <div className="flex bg-stone-100 p-1.5 rounded-2xl border-2 border-stone-100">
            {(['daily', 'monthly', 'yearly'] as const).map((p) => (
              <button 
                key={p}
                onClick={() => setFilterPeriod(p)}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterPeriod === p ? 'bg-white text-rose-600 shadow-lg' : 'text-stone-400 hover:text-stone-600'}`}
              >
                {p === 'daily' ? 'Harian' : p === 'monthly' ? 'Bulanan' : 'Tahunan'}
              </button>
            ))}
          </div>

          <button 
            onClick={handleExportPDF}
            disabled={isExporting}
            className={`${isExporting ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'} food-gradient flex items-center gap-3 text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl shadow-rose-200 transition-all`}
          >
            {isExporting ? (
              <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Download className="h-5 w-5" />
            )}
            {isExporting ? 'Memproses...' : 'PDF'}
          </button>
          <button 
            onClick={handleExportXLS}
            className="bg-emerald-600 flex items-center gap-3 text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl shadow-emerald-200 hover:scale-105 transition-all active:scale-95"
          >
            <FileSpreadsheet className="h-5 w-5" /> XLS
          </button>
        </div>
      </div>

      <div ref={reportRef} className="space-y-12 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-xl shadow-stone-200/40">
          <p className="text-stone-400 text-[10px] font-black uppercase tracking-[0.2em]">Total Terjual</p>
          <h3 className="text-3xl font-black mt-2 text-stone-900 tracking-tight">{reportData.totalTerjual} <span className="text-sm font-medium text-stone-400">Pcs</span></h3>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-xl shadow-stone-200/40">
          <p className="text-stone-400 text-[10px] font-black uppercase tracking-[0.2em]">Total Retur</p>
          <h3 className="text-3xl font-black mt-2 text-rose-600 tracking-tight">{reportData.totalRetur} <span className="text-sm font-medium text-stone-400">Pcs</span></h3>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-xl shadow-stone-200/40">
          <p className="text-stone-400 text-[10px] font-black uppercase tracking-[0.2em]">Total Pendapatan</p>
          <h3 className="text-3xl font-black mt-2 text-emerald-600 tracking-tight whitespace-nowrap">Rp. {reportData.totalPendapatan.toLocaleString()}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-stone-100 shadow-2xl shadow-stone-200/40">
          <h3 className="font-serif text-2xl font-black mb-10 text-stone-900 flex items-center gap-3">
            <BarChart3 className="h-7 w-7 text-rose-600" />
            Statistik Distribusi {filterPeriod === 'daily' ? 'Hari Ini' : filterPeriod === 'monthly' ? 'Bulan Ini' : 'Tahun Ini'}
          </h3>
          <div className="h-80 flex items-end justify-between gap-4 px-4">
            {[45, 65, 35, 85, 55, 95, 75].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                <div 
                  style={{ height: `${h}%` }} 
                  className="w-full food-gradient rounded-2xl relative group-hover:scale-x-110 transition-all cursor-pointer shadow-lg shadow-rose-100"
                >
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-stone-900 text-white text-[10px] font-black px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                    {h}%
                  </div>
                </div>
                <span className="text-[10px] font-black text-stone-300 uppercase tracking-widest">
                  {filterPeriod === 'yearly' ? `Q${Math.floor(i/2)+1}` : `W${i+1}`}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-10 rounded-[3rem] border border-stone-100 shadow-2xl shadow-stone-200/40">
          <h3 className="font-serif text-2xl font-black mb-10 text-stone-900">Performa Toko</h3>
          <div className="space-y-8">
            {pelanggans.slice(0, 5).map((p: any, i: number) => {
              const storeTitipans = titipans.filter((t: any) => t.pelangganId === p.id);
              const storeSales = storeTitipans.reduce((acc: number, t: any) => acc + (t.terjual || 0), 0);
              return (
                <div key={p.id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-5">
                    <div className="h-12 w-12 rounded-2xl bg-stone-50 flex items-center justify-center font-black text-stone-300 group-hover:text-amber-500 group-hover:bg-amber-50 transition-all">{i+1}</div>
                    <div>
                      <p className="text-base font-black text-stone-900 tracking-tight">{p.nama}</p>
                      <p className="text-xs text-stone-400 font-medium">{storeSales} Pcs Terjual</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-emerald-600">+{Math.floor(Math.random() * 20)}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
