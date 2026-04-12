"use client";

import { useState } from 'react';
import { Search, AlertTriangle, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    score: number;
    highlights: { tactic: string, description: string }[];
  } | null>(null);

  const handleAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setResults(null);

    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-matrix-bg text-matrix-primary flex flex-col items-center p-8 font-mono">
      {/* Navbar with Logo */}
      <nav className="w-full max-w-5xl flex justify-between items-center mb-16">
        <div className="flex items-center gap-3">
          <span className="font-bold text-xl tracking-wider text-matrix-primary">ORACLE<span className="text-matrix-secondary">INTENT</span></span>
        </div>
      </nav>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl w-full flex flex-col items-center gap-12"
      >
        <div className="text-center space-y-6 flex flex-col items-center">
          <Image
            src="/logo.jpg"
            alt="OpenGradient Logo"
            width={96}
            height={96}
            className="w-24 h-24 rounded-full aspect-square object-cover shadow-[0_0_25px_rgba(194,231,244,0.6)] mb-4"
          />
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">
            Audit the Human, <br />
            <span className="text-matrix-secondary">Not the Code.</span>
          </h1>
          <p className="text-lg md:text-xl text-matrix-primary/70 max-w-2xl mx-auto">
            Scan GitHub repositories for behavioral manipulation patterns. Uncover gaslighting, FOMO, and transparency issues in founder documentation.
          </p>
        </div>

        <form onSubmit={handleAudit} className="w-full max-w-xl flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-matrix-secondary" />
            <input
              type="url"
              placeholder="Enter GitHub URL (e.g. https://github.com/user/repo)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="w-full bg-matrix-bg border border-matrix-secondary/30 rounded-xl py-4 pl-12 pr-4 text-matrix-primary placeholder:text-matrix-primary/40 focus:outline-none focus:border-matrix-primary focus:ring-1 focus:ring-matrix-primary transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-matrix-primary text-matrix-bg px-8 py-4 rounded-xl font-bold hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? 'Scanning...' : 'Audit'}
          </button>
        </form>

        {results && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full bg-matrix-bg border border-matrix-secondary/20 rounded-2xl p-8 space-y-8"
          >
            <div className="flex flex-col items-center gap-4 pb-8 border-b border-matrix-secondary/20">
              <h2 className="text-2xl font-bold text-matrix-primary/80">Founder Integrity Score</h2>
              <div
                className="relative flex items-center justify-center w-32 h-32 rounded-full border-4 shadow-[0_0_20px_rgba(104,176,211,0.4)]"
                style={{
                  borderColor: `rgba(104,176,211, ${results.score / 100})`,
                  backgroundColor: 'rgba(0,48,73,0.5)'
                }}
              >
                <span className="text-4xl font-bold text-matrix-primary drop-shadow-[0_0_8px_rgba(194,231,244,0.8)]">{results.score}</span>
                <span className="text-sm absolute bottom-4 text-matrix-primary/60">/100</span>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-matrix-primary shadow-matrix-secondary" />
                Dark Psychology Tactics Detected
              </h3>

              {results.highlights.length > 0 ? (
                <div className="grid gap-4">
                  {results.highlights.map((h, i) => (
                    <div key={i} className="bg-matrix-bg border border-matrix-secondary/40 p-4 rounded-lg flex items-start gap-4 shadow-[0_0_10px_rgba(104,176,211,0.15)] transition-shadow hover:shadow-[0_0_15px_rgba(104,176,211,0.3)]">
                      <div className="w-2 h-2 rounded-full bg-matrix-secondary mt-2 flex-shrink-0 shadow-[0_0_5px_#68B0D3]" />
                      <div>
                        <h4 className="font-bold text-matrix-primary">{h.tactic}</h4>
                        <p className="text-matrix-primary/70 mt-1">{h.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-3 text-matrix-primary bg-matrix-secondary/10 p-4 rounded-lg border border-matrix-secondary/30">
                  <ShieldCheck className="w-6 h-6 text-matrix-secondary" />
                  <p>No manipulation tactics detected. Documentation appears transparent.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </motion.div>
    </main>
  );
}
