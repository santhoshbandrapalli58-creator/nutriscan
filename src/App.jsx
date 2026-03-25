import { useState, useEffect, useRef, useCallback } from "react";

// ─── Embedded CSS ────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #0a0f0a;
  --bg2: #111811;
  --bg3: #182018;
  --card: #1a221a;
  --card2: #1f281f;
  --border: rgba(120,200,100,0.12);
  --green: #6dde5e;
  --green2: #4ab83d;
  --green-dim: rgba(109,222,94,0.15);
  --yellow: #f0c040;
  --yellow-dim: rgba(240,192,64,0.12);
  --red: #f05050;
  --red-dim: rgba(240,80,80,0.12);
  --text: #e8f0e8;
  --text2: #8aa088;
  --text3: #506050;
  --radius: 16px;
  --radius-sm: 10px;
  --shadow: 0 8px 40px rgba(0,0,0,0.6);
}

body {
  font-family: 'DM Sans', sans-serif;
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
  overflow-x: hidden;
}

h1,h2,h3,h4 { font-family: 'Syne', sans-serif; }

/* Noise overlay */
body::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 0;
  opacity: 0.4;
}

.app-wrap {
  position: relative;
  z-index: 1;
  max-width: 480px;
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Header */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 20px 0;
}
.logo {
  font-family: 'Syne', sans-serif;
  font-weight: 800;
  font-size: 1.2rem;
  color: var(--green);
  letter-spacing: -0.5px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.logo-dot { width:8px; height:8px; border-radius:50%; background:var(--green); animation: pulse 2s infinite; }
@keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.4)} }

/* Auth Screen */
.auth-screen {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 40px 24px;
  gap: 0;
}
.auth-hero {
  margin-bottom: 40px;
}
.auth-hero h1 {
  font-size: 2.8rem;
  font-weight: 800;
  line-height: 1.1;
  background: linear-gradient(135deg, var(--green) 0%, #a8f0a0 60%, var(--text) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 12px;
}
.auth-hero p { color: var(--text2); font-size: 1rem; line-height: 1.6; }

.auth-tabs {
  display: flex;
  background: var(--bg3);
  border-radius: var(--radius-sm);
  padding: 4px;
  margin-bottom: 28px;
  border: 1px solid var(--border);
}
.auth-tab {
  flex: 1;
  padding: 10px;
  border: none;
  background: transparent;
  color: var(--text2);
  font-family: 'Syne', sans-serif;
  font-weight: 600;
  font-size: .9rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all .2s;
}
.auth-tab.active {
  background: var(--green);
  color: #0a0f0a;
}

.field { margin-bottom: 16px; }
.field label {
  display: block;
  font-size: .78rem;
  font-weight: 500;
  color: var(--text2);
  margin-bottom: 6px;
  letter-spacing: .5px;
  text-transform: uppercase;
}
.field input, .field select, .field textarea {
  width: 100%;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 12px 16px;
  color: var(--text);
  font-family: 'DM Sans', sans-serif;
  font-size: .95rem;
  outline: none;
  transition: border-color .2s;
}
.field input:focus, .field select:focus { border-color: var(--green); }
.field select option { background: var(--card); }

.field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

.btn-primary {
  width: 100%;
  padding: 15px;
  background: var(--green);
  color: #0a0f0a;
  border: none;
  border-radius: var(--radius-sm);
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all .2s;
  letter-spacing: .3px;
}
.btn-primary:hover { background: var(--green2); transform: translateY(-1px); }
.btn-primary:active { transform: translateY(0); }
.btn-primary:disabled { opacity: .5; cursor: not-allowed; transform: none; }

.btn-ghost {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text2);
  padding: 12px 20px;
  border-radius: var(--radius-sm);
  font-family: 'DM Sans', sans-serif;
  font-size: .9rem;
  cursor: pointer;
  transition: all .2s;
}
.btn-ghost:hover { border-color: var(--green); color: var(--green); }

/* Main App */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 16px;
}

/* Nav tabs */
.bottom-nav {
  display: flex;
  background: var(--bg3);
  border-top: 1px solid var(--border);
  padding: 8px 0 12px;
}
.nav-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 4px;
  background: none;
  border: none;
  color: var(--text3);
  cursor: pointer;
  transition: color .2s;
  font-size: .65rem;
  font-family: 'DM Sans', sans-serif;
  font-weight: 500;
  letter-spacing: .4px;
  text-transform: uppercase;
}
.nav-btn.active { color: var(--green); }
.nav-icon { font-size: 1.4rem; line-height: 1; }

/* Scanner screen */
.scanner-screen {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.scanner-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  position: relative;
}

.camera-container {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  background: #000;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.camera-container video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.scan-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}
.scan-frame {
  width: 200px;
  height: 120px;
  position: relative;
}
.scan-frame::before, .scan-frame::after {
  content: '';
  position: absolute;
  width: 28px;
  height: 28px;
  border-color: var(--green);
  border-style: solid;
}
.scan-frame::before { top:0; left:0; border-width: 3px 0 0 3px; }
.scan-frame::after { top:0; right:0; border-width: 3px 3px 0 0; }
.scan-frame-b::before, .scan-frame-b::after {
  content: '';
  position: absolute;
  width: 28px;
  height: 28px;
  border-color: var(--green);
  border-style: solid;
}
.scan-frame-b::before { bottom:0; left:0; border-width: 0 0 3px 3px; }
.scan-frame-b::after { bottom:0; right:0; border-width: 0 3px 3px 0; }
.scan-line {
  position: absolute;
  top: 50%;
  left: 6px;
  right: 6px;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--green), transparent);
  animation: scanAnim 2s ease-in-out infinite;
}
@keyframes scanAnim {
  0% { top: 10%; opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { top: 90%; opacity: 0; }
}

.camera-off {
  flex-direction: column;
  gap: 12px;
  color: var(--text2);
  font-size: .9rem;
}
.camera-icon { font-size: 3rem; opacity: .3; }

.scanner-controls {
  padding: 16px;
  display: flex;
  gap: 10px;
}

.manual-input-section {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px;
}
.manual-input-section h3 {
  font-size: .85rem;
  color: var(--text2);
  margin-bottom: 12px;
  font-weight: 600;
  letter-spacing: .5px;
  text-transform: uppercase;
}
.manual-row {
  display: flex;
  gap: 10px;
}
.manual-row input {
  flex: 1;
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 12px 14px;
  color: var(--text);
  font-family: 'DM Sans', sans-serif;
  font-size: .95rem;
  outline: none;
}
.manual-row input:focus { border-color: var(--green); }
.btn-scan {
  padding: 12px 20px;
  background: var(--green);
  color: #0a0f0a;
  border: none;
  border-radius: var(--radius-sm);
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: all .2s;
  font-size: .9rem;
}
.btn-scan:disabled { opacity: .4; cursor: not-allowed; }

/* Results */
.result-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  animation: slideUp .4s ease;
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.product-header {
  padding: 20px;
  border-bottom: 1px solid var(--border);
  display: flex;
  gap: 16px;
  align-items: flex-start;
}
.product-img {
  width: 72px;
  height: 72px;
  border-radius: 10px;
  object-fit: contain;
  background: var(--bg3);
  flex-shrink: 0;
}
.product-img-placeholder {
  width: 72px;
  height: 72px;
  border-radius: 10px;
  background: var(--bg3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  flex-shrink: 0;
}
.product-info h2 {
  font-size: 1.05rem;
  font-weight: 700;
  line-height: 1.3;
  margin-bottom: 6px;
}
.product-brand {
  font-size: .8rem;
  color: var(--text2);
  margin-bottom: 8px;
}
.nutri-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--bg3);
  padding: 4px 10px;
  border-radius: 20px;
  font-size: .75rem;
  font-weight: 600;
  color: var(--text2);
}
.nutri-score {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: .7rem;
  font-weight: 800;
  color: #fff;
}
.ns-a { background: #1a8c3c; }
.ns-b { background: #5aab1f; }
.ns-c { background: #f0c040; color: #000; }
.ns-d { background: #e07020; }
.ns-e { background: #c01010; }

.nutrition-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background: var(--border);
  border-top: 1px solid var(--border);
}
.nut-item {
  background: var(--card);
  padding: 12px 8px;
  text-align: center;
}
.nut-val {
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  font-size: 1rem;
  color: var(--text);
  line-height: 1;
  margin-bottom: 4px;
}
.nut-label {
  font-size: .65rem;
  color: var(--text3);
  text-transform: uppercase;
  letter-spacing: .4px;
}

/* AI Analysis sections */
.analysis-loading {
  padding: 32px 20px;
  text-align: center;
  color: var(--text2);
}
.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border);
  border-top-color: var(--green);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 16px;
}
@keyframes spin { to { transform: rotate(360deg); } }

.analysis-sections { padding: 0 16px 16px; }
.analysis-section {
  border-radius: var(--radius-sm);
  padding: 14px 16px;
  margin-top: 12px;
}
.analysis-section.benefits {
  background: var(--green-dim);
  border: 1px solid rgba(109,222,94,0.25);
}
.analysis-section.cautions {
  background: var(--yellow-dim);
  border: 1px solid rgba(240,192,64,0.25);
}
.analysis-section.avoid {
  background: var(--red-dim);
  border: 1px solid rgba(240,80,80,0.25);
}
.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}
.section-icon { font-size: 1.1rem; }
.section-title {
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  font-size: .9rem;
}
.benefits .section-title { color: var(--green); }
.cautions .section-title { color: var(--yellow); }
.avoid .section-title { color: var(--red); }
.section-items { display: flex; flex-direction: column; gap: 6px; }
.section-item {
  font-size: .85rem;
  line-height: 1.5;
  color: var(--text2);
  padding-left: 12px;
  position: relative;
}
.section-item::before {
  content: '–';
  position: absolute;
  left: 0;
  color: var(--text3);
}

/* Overall verdict */
.verdict-banner {
  margin: 16px 16px 0;
  padding: 14px 16px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  gap: 12px;
}
.verdict-banner.good { background: var(--green-dim); border: 1px solid rgba(109,222,94,.3); }
.verdict-banner.caution { background: var(--yellow-dim); border: 1px solid rgba(240,192,64,.3); }
.verdict-banner.avoid { background: var(--red-dim); border: 1px solid rgba(240,80,80,.3); }
.verdict-icon { font-size: 1.8rem; }
.verdict-text { flex: 1; }
.verdict-label {
  font-family: 'Syne', sans-serif;
  font-weight: 800;
  font-size: 1rem;
  line-height: 1;
  margin-bottom: 4px;
}
.good .verdict-label { color: var(--green); }
.caution .verdict-label { color: var(--yellow); }
.avoid .verdict-label { color: var(--red); }
.verdict-sub { font-size: .8rem; color: var(--text2); }

/* Profile screen */
.profile-screen {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.profile-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 20px;
}
.profile-card h3 {
  font-size: .85rem;
  color: var(--text2);
  margin-bottom: 16px;
  font-weight: 600;
  letter-spacing: .5px;
  text-transform: uppercase;
}
.profile-avatar-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border);
}
.avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--green-dim);
  border: 2px solid var(--green);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
}
.profile-name { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 1.1rem; }
.profile-email { font-size: .82rem; color: var(--text2); margin-top: 2px; }

.tag-list { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
.tag {
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 4px 12px;
  font-size: .78rem;
  color: var(--text2);
}
.tag.green { background: var(--green-dim); border-color: rgba(109,222,94,.3); color: var(--green); }

/* History screen */
.history-screen { display: flex; flex-direction: column; gap: 12px; }
.history-item {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: border-color .2s;
  animation: slideUp .3s ease;
}
.history-item:hover { border-color: rgba(109,222,94,.3); }
.history-verdict {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  flex-shrink: 0;
}
.hv-good { background: var(--green-dim); }
.hv-caution { background: var(--yellow-dim); }
.hv-avoid { background: var(--red-dim); }
.history-info { flex: 1; min-width: 0; }
.history-name {
  font-weight: 600;
  font-size: .9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.history-meta { font-size: .75rem; color: var(--text2); margin-top: 2px; }
.history-barcode { font-size: .7rem; color: var(--text3); margin-top: 1px; font-family: monospace; }

/* Error toast */
.toast {
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--card);
  border: 1px solid var(--red);
  color: var(--red);
  padding: 12px 20px;
  border-radius: var(--radius-sm);
  font-size: .85rem;
  z-index: 100;
  animation: slideUp .3s ease;
  white-space: nowrap;
  max-width: 90vw;
}

/* Scrollable content area */
.scroll-area { overflow-y: auto; flex: 1; }

/* Welcome banner */
.welcome-banner {
  background: linear-gradient(135deg, var(--card) 0%, var(--card2) 100%);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.welcome-text { font-size: .85rem; color: var(--text2); margin-bottom: 4px; }
.welcome-name { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 1.2rem; }
.welcome-emoji { font-size: 2.4rem; }

.stat-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.stat-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px;
  text-align: center;
}
.stat-num {
  font-family: 'Syne', sans-serif;
  font-weight: 800;
  font-size: 2rem;
  line-height: 1;
  margin-bottom: 4px;
}
.stat-label { font-size: .75rem; color: var(--text2); text-transform: uppercase; letter-spacing: .4px; }

.quick-scan-btn {
  background: linear-gradient(135deg, var(--green) 0%, var(--green2) 100%);
  border: none;
  border-radius: var(--radius);
  padding: 18px 24px;
  color: #0a0f0a;
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  font-size: 1.05rem;
  cursor: pointer;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  transition: all .2s;
  box-shadow: 0 8px 24px rgba(109,222,94,0.25);
}
.quick-scan-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(109,222,94,0.35); }

.section-title-sm {
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  font-size: .85rem;
  color: var(--text2);
  text-transform: uppercase;
  letter-spacing: .5px;
  margin-bottom: 8px;
}

.allergen-warning {
  background: var(--red-dim);
  border: 1px solid rgba(240,80,80,.25);
  border-radius: var(--radius-sm);
  padding: 10px 14px;
  font-size: .82rem;
  color: var(--red);
  margin: 12px 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.ingredients-box {
  margin: 12px 16px 0;
  padding: 12px 14px;
  background: var(--bg3);
  border-radius: var(--radius-sm);
  font-size: .78rem;
  color: var(--text2);
  line-height: 1.6;
}
.ingredients-box strong { color: var(--text3); font-size: .7rem; text-transform: uppercase; letter-spacing: .4px; display: block; margin-bottom: 6px; }
`;

// ─── DB — always reads fresh from localStorage ─────────────────────────────
const DB = {
  getUsers:   () => { try { return JSON.parse(localStorage.getItem("hs_users")   || "{}"); } catch { return {}; } },
  getHistory: () => { try { return JSON.parse(localStorage.getItem("hs_history") || "{}"); } catch { return {}; } },

  saveUser(email, data) {
    const u = this.getUsers();
    u[email] = data;
    localStorage.setItem("hs_users", JSON.stringify(u));
  },
  getUser(email) { return this.getUsers()[email] || null; },

  getUserHistory(email) { return this.getHistory()[email] || []; },
  addHistoryEntry(email, entry) {
    const all = this.getHistory();
    if (!all[email]) all[email] = [];
    all[email].push(entry);
    localStorage.setItem("hs_history", JSON.stringify(all));
  },

  saveSession(user) { localStorage.setItem("hs_session", JSON.stringify(user)); },
  getSession()      { try { return JSON.parse(localStorage.getItem("hs_session") || "null"); } catch { return null; } },
  clearSession()    { localStorage.removeItem("hs_session"); }
};

// ─── Helpers ───────────────────────────────────────────────────────────────
function getNutriColor(g) {
  if (!g) return "ns-c";
  const l = g.toLowerCase();
  if (l === "a") return "ns-a";
  if (l === "b") return "ns-b";
  if (l === "c") return "ns-c";
  if (l === "d") return "ns-d";
  return "ns-e";
}

async function fetchFoodData(barcode) {
  const url = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Network error");
  const data = await res.json();
  if (data.status !== 1) throw new Error("Product not found");
  return data.product;
}

async function analyzeWithAI(productData, userProfile) {
  const prompt = `You are a clinical nutritionist AI. Analyze this food product for a specific user.

USER HEALTH PROFILE:
- Age: ${userProfile.age || "Not specified"}
- Weight: ${userProfile.weight || "Not specified"} kg
- Allergies: ${userProfile.allergies || "None"}
- Health Conditions: ${userProfile.conditions || "None"}
- Diet Type: ${userProfile.diet || "Not specified"}

PRODUCT DATA:
- Name: ${productData.name}
- Ingredients: ${productData.ingredients?.substring(0, 600) || "Not available"}
- Nutrition per 100g: Calories: ${productData.calories}, Protein: ${productData.protein}g, Fat: ${productData.fat}g, Sugar: ${productData.sugar}g, Salt: ${productData.salt}g
- Nutri-Score: ${productData.nutriScore || "N/A"}

Return ONLY a valid JSON object (no markdown, no explanation, no backticks) in this exact format:
{
  "verdict": "good" or "caution" or "avoid",
  "verdictReason": "one line summary",
  "benefits": ["benefit 1", "benefit 2"],
  "cautions": ["caution 1"],
  "avoidReasons": ["reason 1"],
  "allergenAlert": true or false,
  "allergenDetail": "detail or null"
}`;

  const res = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  if (!res.ok) throw new Error("AI analysis failed");
  const data = await res.json();
  const clean = data.text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}


// ─── Components ────────────────────────────────────────────────────────────

function Toast({ msg, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, []);
  return <div className="toast">⚠️ {msg}</div>;
}

function AuthScreen({ onLogin }) {
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({
    email: "", password: "", name: "",
    age: "", weight: "", allergies: "",
    conditions: "", diet: "none"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = () => {
    setError("");
    if (!form.email || !form.password) { setError("Email and password required"); return; }
    setLoading(true);
    setTimeout(() => {
      if (tab === "login") {
        const u = DB.getUser(form.email);
        if (!u) { setError("No account found with this email"); setLoading(false); return; }
        if (u.password !== form.password) { setError("Incorrect password"); setLoading(false); return; }
        // Always load full fresh profile from DB on login
        const freshUser = DB.getUser(form.email);
        DB.saveSession(freshUser);
        onLogin(freshUser);
      } else {
        if (!form.name) { setError("Name required"); setLoading(false); return; }
        if (DB.getUser(form.email)) { setError("Email already registered"); setLoading(false); return; }
        const u = { ...form, id: Date.now() };
        DB.saveUser(form.email, u);
        // ensure history key exists
        const all = DB.getHistory(); if (!all[form.email]) { all[form.email] = []; localStorage.setItem("hs_history", JSON.stringify(all)); }
        DB.saveSession(u);
        onLogin(u);
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="auth-screen">
      <div className="auth-hero">
        <h1>Eat<br/>Smarter,<br/>Live Better.</h1>
        <p>Scan any food product and get instant AI-powered health insights tailored to your profile.</p>
      </div>
      <div className="auth-tabs">
        <button className={`auth-tab ${tab === "login" ? "active" : ""}`} onClick={() => setTab("login")}>Sign In</button>
        <button className={`auth-tab ${tab === "signup" ? "active" : ""}`} onClick={() => setTab("signup")}>Create Account</button>
      </div>
      {error && <div style={{ color: "var(--red)", fontSize: ".82rem", marginBottom: 12, padding: "8px 12px", background: "var(--red-dim)", borderRadius: 8 }}>{error}</div>}
      {tab === "signup" && (
        <div className="field"><label>Full Name</label>
          <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="Jane Doe" />
        </div>
      )}
      <div className="field"><label>Email</label>
        <input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="you@example.com" />
      </div>
      <div className="field"><label>Password</label>
        <input type="password" value={form.password} onChange={e => set("password", e.target.value)} placeholder="••••••••" />
      </div>
      {tab === "signup" && (<>
        <div className="field-row">
          <div className="field"><label>Age</label>
            <input type="number" value={form.age} onChange={e => set("age", e.target.value)} placeholder="25" />
          </div>
          <div className="field"><label>Weight (kg)</label>
            <input type="number" value={form.weight} onChange={e => set("weight", e.target.value)} placeholder="70" />
          </div>
        </div>
        <div className="field"><label>Allergies</label>
          <input value={form.allergies} onChange={e => set("allergies", e.target.value)} placeholder="nuts, gluten, dairy..." />
        </div>
        <div className="field"><label>Health Conditions</label>
          <input value={form.conditions} onChange={e => set("conditions", e.target.value)} placeholder="diabetes, hypertension..." />
        </div>
        <div className="field"><label>Diet Type</label>
          <select value={form.diet} onChange={e => set("diet", e.target.value)}>
            <option value="none">No specific diet</option>
            <option value="vegan">Vegan</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="keto">Keto</option>
            <option value="paleo">Paleo</option>
            <option value="gluten-free">Gluten-Free</option>
            <option value="halal">Halal</option>
            <option value="kosher">Kosher</option>
          </select>
        </div>
      </>)}
      <button className="btn-primary" onClick={handleSubmit} disabled={loading} style={{ marginTop: 4 }}>
        {loading ? "Please wait..." : tab === "login" ? "Sign In" : "Create Account"}
      </button>
    </div>
  );
}

function HomeScreen({ user, history, onScan }) {
  const goodCount = history.filter(h => h.verdict === "good").length;
  const warnCount = history.filter(h => h.verdict === "caution").length;
  const avoidCount = history.filter(h => h.verdict === "avoid").length;
  const recent = [...history].reverse().slice(0, 3);

  return (
    <div className="scanner-screen">
      <div className="welcome-banner">
        <div>
          <div className="welcome-text">Welcome back,</div>
          <div className="welcome-name">{user.name?.split(" ")[0] || "User"} 👋</div>
          <div style={{ fontSize: ".78rem", color: "var(--text3)", marginTop: 4 }}>{user.diet !== "none" && user.diet ? `🥗 ${user.diet.charAt(0).toUpperCase() + user.diet.slice(1)}` : "No diet set"}</div>
        </div>
        <div className="welcome-emoji">🔬</div>
      </div>

      <button className="quick-scan-btn" onClick={onScan}>
        <span>📷</span> Scan a Product
      </button>

      <div className="stat-row">
        <div className="stat-card">
          <div className="stat-num" style={{ color: "var(--green)" }}>{goodCount}</div>
          <div className="stat-label">✅ Safe Scans</div>
        </div>
        <div className="stat-card">
          <div className="stat-num" style={{ color: "var(--red)" }}>{avoidCount}</div>
          <div className="stat-label">❌ Avoid Scans</div>
        </div>
      </div>

      {recent.length > 0 && (<>
        <div className="section-title-sm">Recent Scans</div>
        {recent.map((h, i) => (
          <div className="history-item" key={i}>
            <div className={`history-verdict hv-${h.verdict}`}>{h.verdict === "good" ? "✅" : h.verdict === "caution" ? "⚠️" : "❌"}</div>
            <div className="history-info">
              <div className="history-name">{h.name}</div>
              <div className="history-meta">{h.date}</div>
            </div>
          </div>
        ))}
      </>)}
    </div>
  );
}

function ScannerScreen({ user, onResult }) {
  const [cameraOn, setCameraOn] = useState(false);
  const [barcode, setBarcode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraOn(true);
    } catch (e) {
      setError("Camera access denied. Please use manual entry.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraOn(false);
  };

  useEffect(() => () => stopCamera(), []);

  const doScan = async (code) => {
    const bc = code || barcode.trim();
    if (!bc) { setError("Enter a barcode number"); return; }
    setError("");
    setLoading(true);
    try {
      const product = await fetchFoodData(bc);
      const pd = {
        name: product.product_name || product.product_name_en || "Unknown Product",
        brand: product.brands || "",
        ingredients: product.ingredients_text || product.ingredients_text_en || "",
        calories: product.nutriments?.["energy-kcal_100g"] || product.nutriments?.energy_100g || "N/A",
        protein: product.nutriments?.proteins_100g ?? "N/A",
        fat: product.nutriments?.fat_100g ?? "N/A",
        saturatedFat: product.nutriments?.["saturated-fat_100g"] ?? "N/A",
        sugar: product.nutriments?.sugars_100g ?? "N/A",
        salt: product.nutriments?.salt_100g ?? "N/A",
        fiber: product.nutriments?.fiber_100g ?? "N/A",
        nutriScore: product.nutrition_grades?.toUpperCase(),
        novaGroup: product.nova_group,
        image: product.image_front_small_url || product.image_url || null,
        barcode: bc
      };
      stopCamera();
      onResult(pd, user);
    } catch (e) {
      setError(e.message || "Could not fetch product");
    }
    setLoading(false);
  };

  return (
    <div className="scanner-screen">
      {error && <div style={{ background:"var(--red-dim)", border:"1px solid var(--red)", borderRadius:"var(--radius-sm)", padding:"10px 14px", fontSize:".82rem", color:"var(--red)" }}>⚠️ {error}</div>}

      <div className="scanner-card">
        <div className="camera-container" style={{ display: "flex" }}>
          {cameraOn ? (<>
            <video ref={videoRef} autoPlay playsInline muted style={{ width:"100%", height:"100%", objectFit:"cover" }} />
            <div className="scan-overlay">
              <div className="scan-frame">
                <div className="scan-frame-b"></div>
                <div className="scan-line"></div>
              </div>
            </div>
          </>) : (
            <div className="camera-off" style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", width:"100%", height:"100%", gap:12 }}>
              <div className="camera-icon">📷</div>
              <span style={{ fontSize:".85rem", color:"var(--text2)" }}>Camera ready to scan</span>
            </div>
          )}
        </div>
        <div className="scanner-controls">
          {!cameraOn
            ? <button className="btn-primary" onClick={startCamera} style={{ flex:1 }}>Start Camera</button>
            : <>
                <button className="btn-ghost" onClick={stopCamera} style={{ flex:1 }}>Stop</button>
                <button className="btn-scan" onClick={() => { const b = prompt("Enter the barcode number shown:"); if (b) doScan(b); }} style={{ flex:2 }} disabled={loading}>
                  {loading ? "Scanning..." : "📸 Capture Code"}
                </button>
              </>
          }
        </div>
      </div>

      <div className="manual-input-section">
        <h3>Manual Entry</h3>
        <div className="manual-row">
          <input
            value={barcode}
            onChange={e => setBarcode(e.target.value)}
            placeholder="e.g. 3017620422003"
            onKeyDown={e => e.key === "Enter" && doScan()}
          />
          <button className="btn-scan" onClick={() => doScan()} disabled={loading}>
            {loading ? "…" : "Analyze"}
          </button>
        </div>
        <div style={{ marginTop:10, fontSize:".74rem", color:"var(--text3)" }}>
          💡 Try: <span style={{cursor:"pointer", color:"var(--text2)"}} onClick={() => setBarcode("3017620422003")}>Nutella (3017620422003)</span> · <span style={{cursor:"pointer", color:"var(--text2)"}} onClick={() => setBarcode("0038000845260")}>Kellogg's (0038000845260)</span>
        </div>
      </div>
    </div>
  );
}

function ResultScreen({ product, analysis, loading, onReAnalyze }) {
  if (!product) return (
    <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:12, color:"var(--text2)", padding:32, textAlign:"center" }}>
      <div style={{ fontSize:"3rem" }}>🔍</div>
      <div style={{ fontFamily:"Syne", fontWeight:700, fontSize:"1rem" }}>No product scanned yet</div>
      <div style={{ fontSize:".85rem" }}>Go to Scanner tab to scan a barcode</div>
    </div>
  );

  const currentUser = DB.getSession() || {};
  const fmt = v => (v === "N/A" || v === undefined || v === null) ? "—" : v;

  return (
    <div className="scanner-screen">
      <div className="result-card">
        <div className="product-header">
          {product.image
            ? <img src={product.image} alt={product.name} className="product-img" />
            : <div className="product-img-placeholder">🛒</div>
          }
          <div className="product-info">
            <h2>{product.name}</h2>
            {product.brand && <div className="product-brand">{product.brand}</div>}
            {product.nutriScore && (
              <div className="nutri-badge">
                Nutri-Score
                <div className={`nutri-score ${getNutriColor(product.nutriScore)}`}>{product.nutriScore}</div>
              </div>
            )}
          </div>
        </div>

        <div className="nutrition-grid">
          {[
            { val: fmt(product.calories), label: "kcal" },
            { val: fmt(product.protein) !== "—" ? fmt(product.protein)+"g" : "—", label: "Protein" },
            { val: fmt(product.fat) !== "—" ? fmt(product.fat)+"g" : "—", label: "Fat" },
            { val: fmt(product.sugar) !== "—" ? fmt(product.sugar)+"g" : "—", label: "Sugar" },
          ].map((n, i) => (
            <div className="nut-item" key={i}>
              <div className="nut-val">{n.val}</div>
              <div className="nut-label">{n.label}</div>
            </div>
          ))}
        </div>

        {product.ingredients && (
          <div className="ingredients-box">
            <strong>Ingredients</strong>
            {product.ingredients.substring(0, 200)}{product.ingredients.length > 200 ? "..." : ""}
          </div>
        )}

        {loading ? (
          <div className="analysis-loading">
            <div className="loading-spinner"></div>
            <div style={{ fontFamily:"Syne", fontWeight:700, marginBottom:4 }}>Analyzing for your profile…</div>
            <div style={{ fontSize:".8rem" }}>Checking ingredients, nutrition & health conditions</div>
          </div>
        ) : analysis ? (<>
          {analysis.allergenAlert && (
            <div className="allergen-warning">
              🚨 <strong>Allergen Alert:</strong> {analysis.allergenDetail}
            </div>
          )}

          <div className={`verdict-banner ${analysis.verdict}`}>
            <div className="verdict-icon">{analysis.verdict === "good" ? "✅" : analysis.verdict === "caution" ? "⚠️" : "❌"}</div>
            <div className="verdict-text">
              <div className="verdict-label">{analysis.verdict === "good" ? "Good For You" : analysis.verdict === "caution" ? "Proceed with Caution" : "Not Recommended"}</div>
              <div className="verdict-sub">{analysis.verdictReason}</div>
            </div>
          </div>

          <div className="analysis-sections">
            {analysis.benefits?.length > 0 && (
              <div className="analysis-section benefits">
                <div className="section-header"><span className="section-icon">✅</span><span className="section-title">Benefits</span></div>
                <div className="section-items">{analysis.benefits.map((b, i) => <div className="section-item" key={i}>{b}</div>)}</div>
              </div>
            )}
            {analysis.cautions?.length > 0 && (
              <div className="analysis-section cautions">
                <div className="section-header"><span className="section-icon">⚠️</span><span className="section-title">Cautions</span></div>
                <div className="section-items">{analysis.cautions.map((c, i) => <div className="section-item" key={i}>{c}</div>)}</div>
              </div>
            )}
            {analysis.avoidReasons?.length > 0 && (
              <div className="analysis-section avoid">
                <div className="section-header"><span className="section-icon">❌</span><span className="section-title">Avoid Reasons</span></div>
                <div className="section-items">{analysis.avoidReasons.map((r, i) => <div className="section-item" key={i}>{r}</div>)}</div>
              </div>
            )}
          </div>
        </>) : null}
      </div>

      {/* Current profile used — shows what data the analysis is based on */}
      <div style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:"var(--radius)", padding:"14px 16px" }}>
        <div style={{ fontSize:".7rem", color:"var(--text3)", textTransform:"uppercase", letterSpacing:".4px", marginBottom:10 }}>
          Analysis based on your profile
        </div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom: 12 }}>
          {currentUser.conditions
            ? <span style={{ background:"var(--red-dim)", border:"1px solid rgba(240,80,80,.2)", borderRadius:20, padding:"3px 10px", fontSize:".75rem", color:"var(--red)" }}>🏥 {currentUser.conditions}</span>
            : <span style={{ fontSize:".78rem", color:"var(--text3)" }}>No health conditions set</span>}
          {currentUser.allergies && <span style={{ background:"var(--yellow-dim)", border:"1px solid rgba(240,192,64,.2)", borderRadius:20, padding:"3px 10px", fontSize:".75rem", color:"var(--yellow)" }}>⚠️ {currentUser.allergies}</span>}
          {currentUser.diet && currentUser.diet !== "none" && <span style={{ background:"var(--green-dim)", border:"1px solid rgba(109,222,94,.2)", borderRadius:20, padding:"3px 10px", fontSize:".75rem", color:"var(--green)" }}>🥗 {currentUser.diet}</span>}
          {currentUser.age && <span style={{ background:"var(--bg3)", border:"1px solid var(--border)", borderRadius:20, padding:"3px 10px", fontSize:".75rem", color:"var(--text2)" }}>Age {currentUser.age}</span>}
        </div>
        <div style={{ fontSize:".73rem", color:"var(--text3)", marginBottom:10 }}>
          Updated your profile? Click below to re-run the analysis with your latest details.
        </div>
        <button
          className="btn-ghost"
          style={{ width:"100%", fontSize:".85rem" }}
          onClick={onReAnalyze}
          disabled={loading}
        >
          {loading ? "Analyzing…" : "🔄 Re-analyze with current profile"}
        </button>
      </div>
    </div>
  );
}

function HistoryScreen({ history }) {
  if (!history.length) return (
    <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:12, color:"var(--text2)", padding:32, textAlign:"center" }}>
      <div style={{ fontSize:"3rem" }}>📜</div>
      <div style={{ fontFamily:"Syne", fontWeight:700 }}>No scan history yet</div>
      <div style={{ fontSize:".85rem" }}>Your scanned products will appear here</div>
    </div>
  );

  return (
    <div className="history-screen">
      <div className="section-title-sm">All Scans ({history.length})</div>
      {[...history].reverse().map((h, i) => (
        <div className="history-item" key={i}>
          <div className={`history-verdict hv-${h.verdict}`}>{h.verdict === "good" ? "✅" : h.verdict === "caution" ? "⚠️" : "❌"}</div>
          <div className="history-info">
            <div className="history-name">{h.name}</div>
            <div className="history-meta">{h.date}</div>
            <div className="history-barcode">{h.barcode}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProfileScreen({ user, onLogout, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...user });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const save = () => {
    const updated = { ...DB.getUser(user.email), ...form };
    DB.saveUser(user.email, updated);
    DB.saveSession(updated);
    onUpdate(updated);
    setEditing(false);
  };

  return (
    <div className="profile-screen">
      <div className="profile-card">
        <div className="profile-avatar-row">
          <div className="avatar">🧑</div>
          <div>
            <div className="profile-name">{user.name}</div>
            <div className="profile-email">{user.email}</div>
          </div>
        </div>

        {editing ? (<>
          <div className="field-row">
            <div className="field"><label>Age</label><input type="number" value={form.age} onChange={e => set("age", e.target.value)} /></div>
            <div className="field"><label>Weight (kg)</label><input type="number" value={form.weight} onChange={e => set("weight", e.target.value)} /></div>
          </div>
          <div className="field"><label>Allergies</label><input value={form.allergies} onChange={e => set("allergies", e.target.value)} placeholder="nuts, gluten..." /></div>
          <div className="field"><label>Health Conditions</label><input value={form.conditions} onChange={e => set("conditions", e.target.value)} placeholder="diabetes..." /></div>
          <div className="field"><label>Diet</label>
            <select value={form.diet} onChange={e => set("diet", e.target.value)}>
              <option value="none">No specific diet</option>
              <option value="vegan">Vegan</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="keto">Keto</option>
              <option value="paleo">Paleo</option>
              <option value="gluten-free">Gluten-Free</option>
              <option value="halal">Halal</option>
              <option value="kosher">Kosher</option>
            </select>
          </div>
          <div style={{ display:"flex", gap:10, marginTop:8 }}>
            <button className="btn-primary" style={{ flex:1 }} onClick={save}>Save</button>
            <button className="btn-ghost" style={{ flex:1 }} onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </>) : (<>
          <h3>Health Profile</h3>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
            {[["Age", user.age + " yrs"], ["Weight", user.weight + " kg"]].map(([l,v]) => (
              <div key={l} style={{ background:"var(--bg3)", borderRadius:8, padding:"10px 12px" }}>
                <div style={{ fontSize:".7rem", color:"var(--text3)", textTransform:"uppercase", letterSpacing:".4px", marginBottom:4 }}>{l}</div>
                <div style={{ fontFamily:"Syne", fontWeight:700 }}>{v || "—"}</div>
              </div>
            ))}
          </div>

          {user.diet && user.diet !== "none" && (<>
            <div style={{ fontSize:".72rem", color:"var(--text3)", textTransform:"uppercase", letterSpacing:".4px", marginBottom:6 }}>Diet</div>
            <div className="tag-list" style={{ marginBottom:14 }}>
              <span className="tag green">{user.diet}</span>
            </div>
          </>)}

          {user.allergies && (<>
            <div style={{ fontSize:".72rem", color:"var(--text3)", textTransform:"uppercase", letterSpacing:".4px", marginBottom:6 }}>Allergies</div>
            <div className="tag-list" style={{ marginBottom:14 }}>
              {user.allergies.split(",").map(a => a.trim()).filter(Boolean).map((a,i) => <span className="tag" key={i}>{a}</span>)}
            </div>
          </>)}

          {user.conditions && (<>
            <div style={{ fontSize:".72rem", color:"var(--text3)", textTransform:"uppercase", letterSpacing:".4px", marginBottom:6 }}>Health Conditions</div>
            <div className="tag-list" style={{ marginBottom:14 }}>
              {user.conditions.split(",").map(c => c.trim()).filter(Boolean).map((c,i) => <span className="tag" key={i}>{c}</span>)}
            </div>
          </>)}

          <button className="btn-ghost" style={{ width:"100%", marginTop:8 }} onClick={() => setEditing(true)}>✏️ Edit Profile</button>
        </>)}
      </div>

      <button className="btn-ghost" style={{ width:"100%" }} onClick={onLogout}>Sign Out</button>
    </div>
  );
}

// ─── App ────────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(() => DB.getSession());
  const [tab, setTab] = useState("home");
  const [product, setProduct] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [toast, setToast] = useState("");

  // Always read history fresh from DB
  const history = user ? DB.getUserHistory(user.email).filter(Boolean) : [];

  const login = (u) => {
    // Load full profile from DB (not just what was passed)
    const freshUser = DB.getUser(u.email) || u;
    DB.saveSession(freshUser);
    setUser(freshUser);
  };
  const logout = () => {
    DB.clearSession();
    setUser(null);
    setProduct(null);
    setAnalysis(null);
    setTab("home");
  };
  const updateUser = (u) => {
    DB.saveUser(u.email, u);
    DB.saveSession(u);
    setUser(u);
  };

  const handleResult = async (pd, _u) => {
    // Always read freshest profile from DB
    const latestUser = DB.getUser(user.email) || user;
    setProduct(pd);
    setAnalysis(null);
    setTab("result");
    setAnalysisLoading(true);
    try {
      const ai = await analyzeWithAI(pd, latestUser);
      setAnalysis(ai);
      const entry = {
        name: pd.name,
        barcode: pd.barcode,
        verdict: ai.verdict,
        date: new Date().toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })
      };
      DB.addHistoryEntry(latestUser.email, entry);
    } catch (e) {
      setToast("AI analysis failed: " + e.message);
    }
    setAnalysisLoading(false);
  };

  const reAnalyze = async () => {
    if (!product) return;
    const latestUser = DB.getUser(user.email) || user;
    setAnalysis(null);
    setAnalysisLoading(true);
    try {
      const ai = await analyzeWithAI(product, latestUser);
      setAnalysis(ai);
    } catch (e) {
      setToast("AI analysis failed: " + e.message);
    }
    setAnalysisLoading(false);
  };

  const TABS = [
    { id: "home", icon: "🏠", label: "Home" },
    { id: "scan", icon: "📷", label: "Scan" },
    { id: "result", icon: "📊", label: "Result" },
    { id: "history", icon: "📜", label: "History" },
    { id: "profile", icon: "👤", label: "Profile" },
  ];

  return (<>
    <style>{CSS}</style>
    <div className="app-wrap">
      {!user ? (
        <AuthScreen onLogin={login} />
      ) : (<>
        <div className="header">
          <div className="logo"><div className="logo-dot"></div>NutriScan</div>
          <div style={{ fontSize:".78rem", color:"var(--text3)" }}>AI-Powered</div>
        </div>
        <div className="main-content scroll-area">
          {tab === "home" && <HomeScreen user={user} history={history} onScan={() => setTab("scan")} />}
          {tab === "scan" && <ScannerScreen user={user} onResult={handleResult} />}
          {tab === "result" && <ResultScreen product={product} analysis={analysis} loading={analysisLoading} onReAnalyze={reAnalyze} />}
          {tab === "history" && <HistoryScreen history={history} />}
          {tab === "profile" && <ProfileScreen user={user} onLogout={logout} onUpdate={updateUser} />}
        </div>
        <nav className="bottom-nav">
          {TABS.map(t => (
            <button key={t.id} className={`nav-btn ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>
              <span className="nav-icon">{t.icon}</span>{t.label}
            </button>
          ))}
        </nav>
      </>)}
      {toast && <Toast msg={toast} onClose={() => setToast("")} />}
    </div>
  </>);
}
