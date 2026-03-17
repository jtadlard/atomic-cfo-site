import { useState, useEffect, useRef } from "react";

const CALENDLY_URL = "https://calendly.com/jt-adlard/30min";

function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold, rootMargin: "0px 0px 80px 0px" });
    obs.observe(el);
    // Safety fallback: if the observer never fires, show content after 2.5s
    const fallback = setTimeout(() => setVisible(true), 2500);
    return () => { obs.disconnect(); clearTimeout(fallback); };
  }, [threshold]);
  return [ref, visible];
}

const Reveal = ({ children, delay = 0 }) => {
  const [ref, visible] = useInView(0.02);
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(18px)",
      transition: `opacity 0.5s cubic-bezier(.22,1,.36,1) ${delay}s, transform 0.5s cubic-bezier(.22,1,.36,1) ${delay}s`,
    }}>{children}</div>
  );
};

const Ticker = ({ end, suffix = "" }) => {
  const [ref, visible] = useInView(0.05);
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!visible) return;
    const dur = 1100, t0 = performance.now();
    const tick = (now) => {
      const p = Math.min((now - t0) / dur, 1);
      setVal(Math.round((1 - Math.pow(1 - p, 3)) * end));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [visible, end]);
  return <span ref={ref}>{val}{suffix}</span>;
};

// Palette — matched to Atomic CFO logo
const C = {
  navy: "#1B2E4A",
  navyDark: "#111F35",
  navyMid: "#243B5C",
  gold: "#B8943F",
  goldLight: "#CBAA56",
  goldDark: "#9E7D30",
  goldBg: "#FBF7EF",
  goldBg2: "#F8F2E6",
  green: "#2D8A56",
  greenBg: "#EDFAF2",
  blue: "#2F6CB3",
  white: "#FFFFFF",
  bg: "#F8F8F6",
  cream: "#F3F1EC",
  border: "#DDD9D0",
  borderLight: "#ECEAE4",
  text: "#1B2E4A",
  textMid: "#4A576A",
  textLight: "#7B8596",
};

const Btn = ({ children, href = CALENDLY_URL, variant = "primary", onClick, style = {} }) => {
  const [h, setH] = useState(false);
  const base = {
    display: "inline-flex", alignItems: "center", gap: "8px",
    padding: "14px 28px", borderRadius: "8px", fontSize: "15px", fontWeight: 600,
    letterSpacing: "0.01em", cursor: "pointer", textDecoration: "none",
    transition: "all 0.25s ease", border: "none", fontFamily: "inherit",
  };
  const s = variant === "primary"
    ? { ...base, background: h ? C.goldDark : C.gold, color: "#fff", boxShadow: h ? "0 8px 24px rgba(184,148,63,0.28)" : "0 2px 8px rgba(184,148,63,0.14)", transform: h ? "translateY(-1px)" : "none", ...style }
    : variant === "navy"
    ? { ...base, background: h ? C.navyDark : C.navy, color: "#fff", boxShadow: h ? "0 8px 24px rgba(27,46,74,0.25)" : "0 2px 8px rgba(27,46,74,0.12)", transform: h ? "translateY(-1px)" : "none", ...style }
    : { ...base, background: "transparent", color: C.navy, border: `1.5px solid ${C.border}`, boxShadow: h ? "0 4px 12px rgba(0,0,0,0.05)" : "none", ...style };
  return <a href={href} style={s} onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}>{children}</a>;
};

const Label = ({ children, color = C.gold }) => (
  <div style={{
    display: "inline-block", fontSize: "11px", fontWeight: 700,
    letterSpacing: "0.13em", textTransform: "uppercase",
    color, marginBottom: "14px",
    padding: "5px 12px", borderRadius: "100px",
    background: `${color}0D`, border: `1px solid ${color}1A`,
  }}>{children}</div>
);

const Section = ({ id, children, bg = C.white, style = {} }) => (
  <section id={id} style={{ position: "relative", padding: "96px 24px", background: bg, ...style }}>
    <div style={{ maxWidth: "1060px", margin: "0 auto", position: "relative", zIndex: 1 }}>{children}</div>
  </section>
);

const Card = ({ children, style = {} }) => {
  const [h, setH] = useState(false);
  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{
      background: C.white, border: `1px solid ${h ? C.border : C.borderLight}`,
      borderRadius: "12px", padding: "32px", transition: "all 0.3s ease",
      boxShadow: h ? "0 10px 36px rgba(27,46,74,0.06)" : "none",
      transform: h ? "translateY(-2px)" : "none", ...style,
    }}>{children}</div>
  );
};

// ─── Logo SVG matching the uploaded design ───
const Logo = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    {/* Gold particles */}
    <rect x="3" y="28" width="3" height="3" fill={C.gold} opacity="0.5"/>
    <rect x="7" y="25" width="3" height="3" fill={C.gold} opacity="0.6"/>
    <rect x="3" y="24" width="2.5" height="2.5" fill={C.gold} opacity="0.4"/>
    <rect x="8" y="30" width="2" height="2" fill={C.gold} opacity="0.3"/>
    <rect x="11" y="27" width="2.5" height="2.5" fill={C.gold} opacity="0.7"/>
    <rect x="5" y="31" width="2" height="2" fill={C.gold} opacity="0.35"/>
    {/* Navy bars - ascending */}
    <rect x="10" y="22" width="4" height="12" rx="0.5" fill={C.navy}/>
    <rect x="16" y="18" width="4" height="16" rx="0.5" fill={C.navy}/>
    <rect x="22" y="14" width="4" height="20" rx="0.5" fill={C.navy}/>
    <rect x="28" y="8" width="4" height="26" rx="0.5" fill={C.navy}/>
    {/* Arrow */}
    <path d="M8 26L30 6" stroke={C.navy} strokeWidth="2" strokeLinecap="round"/>
    <path d="M24 5L31 5.5L30.5 12.5" stroke={C.navy} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ─── AI Assessment Modal ───
const AssessmentModal = ({ open, onClose }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);

  const questions = [
    { q: "How do you currently track financial performance?", opts: ["Spreadsheets or manual", "Basic accounting software", "Dashboards with some automation", "Fully automated, real-time data"] },
    { q: "How much time does your team spend on repetitive reporting?", opts: ["10+ hours/week", "5–10 hours/week", "2–5 hours/week", "Almost none — it's automated"] },
    { q: "How do you make major business decisions?", opts: ["Gut feel and experience", "Basic financial reports", "KPI dashboards and forecasts", "Data models with scenario planning"] },
    { q: "What's your current use of AI in operations?", opts: ["None at all", "Experimenting with ChatGPT", "A few tools in place", "AI integrated into workflows"] },
  ];

  const score = Object.values(answers).reduce((a, b) => a + b, 0);
  const maxScore = questions.length * 3;
  const pct = Math.round((score / maxScore) * 100);
  const level = pct < 30 ? "Getting Started" : pct < 60 ? "Building" : pct < 85 ? "Advancing" : "Leading";
  const levelColor = pct < 30 ? "#DC6843" : pct < 60 ? C.gold : pct < 85 ? C.blue : C.green;

  if (!open) return null;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center",
      background: "rgba(27,46,74,0.5)", backdropFilter: "blur(8px)", padding: "24px",
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: C.white, borderRadius: "16px", maxWidth: "520px", width: "100%",
        padding: "36px", boxShadow: "0 32px 80px rgba(0,0,0,0.18)", maxHeight: "90vh", overflow: "auto",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <div>
            <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", color: C.gold, textTransform: "uppercase", marginBottom: "4px" }}>Free Assessment</div>
            <h3 style={{ fontFamily: "'Lora', serif", fontSize: "20px", fontWeight: 600, color: C.navy }}>
              {showResult ? "Your Results" : "How ready is your business?"}
            </h3>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "20px", color: C.textLight, cursor: "pointer" }}>✕</button>
        </div>

        {!showResult ? (
          <>
            <div style={{ display: "flex", gap: "6px", marginBottom: "24px" }}>
              {questions.map((_, i) => (
                <div key={i} style={{
                  flex: 1, height: "3px", borderRadius: "2px",
                  background: i <= step ? C.navy : `${C.navy}0D`,
                  transition: "background 0.3s",
                }} />
              ))}
            </div>
            <p style={{ fontSize: "16px", fontWeight: 600, color: C.navy, marginBottom: "16px" }}>{questions[step].q}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {questions[step].opts.map((opt, i) => {
                const sel = answers[step] === i;
                return (
                  <button key={i} onClick={() => {
                    const newA = { ...answers, [step]: i };
                    setAnswers(newA);
                    if (step < questions.length - 1) setTimeout(() => setStep(step + 1), 200);
                    else setTimeout(() => setShowResult(true), 300);
                  }} style={{
                    padding: "13px 16px", borderRadius: "8px", textAlign: "left",
                    fontSize: "14px", fontWeight: 500, cursor: "pointer",
                    background: sel ? `${C.navy}08` : C.bg,
                    border: `1.5px solid ${sel ? C.navy : C.borderLight}`,
                    color: sel ? C.navy : C.textMid, transition: "all 0.2s", fontFamily: "inherit",
                  }}>{opt}</button>
                );
              })}
            </div>
            {step > 0 && <button onClick={() => setStep(step - 1)} style={{ marginTop: "14px", background: "none", border: "none", fontSize: "13px", color: C.textLight, cursor: "pointer", fontFamily: "inherit" }}>← Back</button>}
          </>
        ) : (
          <>
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <div style={{
                width: "110px", height: "110px", borderRadius: "50%", margin: "0 auto 14px",
                background: `conic-gradient(${levelColor} ${pct * 3.6}deg, ${C.bg} 0deg)`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <div style={{
                  width: "90px", height: "90px", borderRadius: "50%", background: C.white,
                  display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column",
                }}>
                  <div style={{ fontSize: "26px", fontWeight: 700, color: C.navy }}>{pct}%</div>
                  <div style={{ fontSize: "11px", color: levelColor, fontWeight: 600 }}>{level}</div>
                </div>
              </div>
              <p style={{ fontSize: "14px", color: C.textMid, lineHeight: 1.7, maxWidth: "380px", margin: "0 auto" }}>
                {pct < 30 ? "There's a lot of low-hanging fruit here. A quick call would help us figure out where to start." : pct < 60 ? "You've got foundations but you're leaving money on the table. A few targeted changes could make a real difference." : pct < 85 ? "You're ahead of most. The next step is connecting financial strategy with AI-powered systems." : "You're in great shape. Let's talk about the next level."}
              </p>
            </div>
            <Btn href={CALENDLY_URL} style={{ width: "100%", justifyContent: "center" }}>Let's Talk →</Btn>
            <button onClick={() => { setStep(0); setAnswers({}); setShowResult(false); }} style={{ display: "block", margin: "10px auto 0", background: "none", border: "none", fontSize: "13px", color: C.textLight, cursor: "pointer", fontFamily: "inherit" }}>Retake</button>
          </>
        )}
      </div>
    </div>
  );
};

// ═══ MAIN ═══
export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [assessmentOpen, setAssessmentOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const nav = [
    { label: "Services", id: "services" },
    { label: "AI Readiness", action: () => setAssessmentOpen(true) },
    { label: "Results", id: "cases" },
    { label: "About", id: "about" },
  ];

  return (
    <div style={{ fontFamily: "'Source Sans 3', sans-serif", color: C.text, background: C.bg, minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Source+Sans+3:wght@300;400;500;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth;overflow-x:hidden} body{background:${C.bg};font-family:'Source Sans 3',sans-serif;color:${C.text};overflow-x:hidden}
        ::selection{background:${C.gold};color:#fff}
        a{color:inherit}
        .nl{font-size:14px;font-weight:500;color:${C.textMid};text-decoration:none;transition:color 0.2s;cursor:pointer;background:none;border:none;font-family:inherit}
        .nl:hover{color:${C.navy}}
        @media(max-width:768px){
          .hero-grid{flex-direction:column!important}
          .g3{grid-template-columns:1fr!important}
          .g4{grid-template-columns:1fr 1fr!important}
          .g2{grid-template-columns:1fr!important}
          .about-grid{grid-template-columns:1fr!important;text-align:center}
          .about-grid>div:last-child{align-items:center!important}
          .footer-grid{grid-template-columns:1fr!important;gap:24px!important}
          .mob-menu{display:flex!important}
          .desk-nav{display:none!important}
          .ht{text-align:center!important;align-items:center!important}
          .hb{justify-content:center!important}
        }
        @media(min-width:769px){.mob-menu{display:none!important}.mob-btn{display:none!important}}
        @keyframes barGrow{from{transform:scaleY(0)}to{transform:scaleY(1)}}
      `}</style>

      <AssessmentModal open={assessmentOpen} onClose={() => setAssessmentOpen(false)} />

      {/* ═══ NAV ═══ */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: scrolled ? "10px 24px" : "16px 24px",
        background: scrolled ? "rgba(248,248,246,0.93)" : "transparent",
        backdropFilter: scrolled ? "blur(14px)" : "none",
        borderBottom: scrolled ? `1px solid ${C.borderLight}` : "none",
        transition: "all 0.3s ease",
      }}>
        <div style={{ maxWidth: "1060px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="#" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
            <img src="/logo.png" alt="Atomic CFO" style={{ height: "34px" }} />
          </a>

          <div className="desk-nav" style={{ display: "flex", alignItems: "center", gap: "28px" }}>
            {nav.map((l, i) => l.action
              ? <button key={i} className="nl" onClick={l.action} style={{ color: C.gold, fontWeight: 600 }}>{l.label}</button>
              : <a key={i} href={`#${l.id}`} className="nl">{l.label}</a>
            )}
            <Btn style={{ padding: "10px 22px", fontSize: "13px" }}>Let's Talk →</Btn>
          </div>

          <button className="mob-btn" onClick={() => setMenuOpen(!menuOpen)} style={{
            background: "none", border: "none", color: C.navy, fontSize: "24px", cursor: "pointer",
          }}>{menuOpen ? "✕" : "☰"}</button>
        </div>

        {menuOpen && (
          <div className="mob-menu" style={{
            flexDirection: "column", gap: "16px", padding: "20px 24px",
            background: "rgba(248,248,246,0.98)", borderTop: `1px solid ${C.borderLight}`,
          }}>
            {nav.map((l, i) => l.action
              ? <button key={i} className="nl" onClick={() => { l.action(); setMenuOpen(false); }}>{l.label}</button>
              : <a key={i} href={`#${l.id}`} className="nl" onClick={() => setMenuOpen(false)} style={{ fontSize: "16px" }}>{l.label}</a>
            )}
            <Btn style={{ textAlign: "center", justifyContent: "center" }}>Let's Talk →</Btn>
          </div>
        )}
      </nav>

      {/* ═══ HERO ═══ */}
      <section style={{
        position: "relative", minHeight: "100vh", display: "flex", alignItems: "center",
        padding: "120px 24px 80px", background: C.white, borderBottom: `1px solid ${C.borderLight}`,
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: 0, right: 0, width: "45%", height: "100%",
          background: `linear-gradient(180deg, ${C.goldBg} 0%, ${C.white} 100%)`,
          opacity: 0.5, pointerEvents: "none",
        }} />

        <div style={{ maxWidth: "1060px", margin: "0 auto", width: "100%", position: "relative", zIndex: 1 }}>
          <div className="hero-grid" style={{ display: "flex", gap: "56px", alignItems: "center" }}>
            <div className="ht" style={{ flex: "1.2", display: "flex", flexDirection: "column", gap: "20px", alignItems: "flex-start" }}>
              <Label>Fractional CFO · AI Advisory · Data Systems</Label>

              <h1 style={{
                fontFamily: "'Lora', serif", fontSize: "clamp(34px, 5vw, 54px)",
                fontWeight: 600, lineHeight: 1.12, color: C.navy, letterSpacing: "-0.02em",
              }}>
                Small changes.<br />
                <span style={{ color: C.gold }}>Massive results.</span>
              </h1>

              <p style={{ fontSize: "18px", lineHeight: 1.75, color: C.textMid, maxWidth: "470px" }}>
                The right numbers, the right systems, and the right AI —
                that's all it takes to transform how your business runs.
                We help you find and build all three.
              </p>

              <div className="hb" style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "4px" }}>
                <Btn>Book a Free Call →</Btn>
                <Btn variant="navy" href="#" onClick={(e) => { e.preventDefault(); setAssessmentOpen(true); }}>Take the AI Readiness Quiz</Btn>
              </div>

              <div className="hb" style={{
                display: "flex", gap: "28px", marginTop: "24px", paddingTop: "24px",
                borderTop: `1px solid ${C.borderLight}`, flexWrap: "wrap",
              }}>
                {[
                  { v: "$1M – $30M", l: "Client Revenue Range" },
                  { v: "100+", l: "AI Systems Built" },
                  { v: "80%", l: "Less Manual Work" },
                ].map((s, i) => (
                  <div key={i}>
                    <div style={{ fontSize: "17px", fontWeight: 700, color: C.navy }}>{s.v}</div>
                    <div style={{ fontSize: "12px", color: C.textLight, marginTop: "2px" }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dashboard with logo-matching bar chart */}
            <div style={{ flex: "0.85", display: "flex", justifyContent: "center" }}>
              <div style={{
                width: "100%", maxWidth: "400px", borderRadius: "14px", background: C.white,
                border: `1px solid ${C.border}`,
                boxShadow: "0 16px 48px rgba(27,46,74,0.07), 0 3px 12px rgba(0,0,0,0.03)",
                overflow: "hidden",
              }}>
                <div style={{
                  padding: "12px 18px", borderBottom: `1px solid ${C.borderLight}`,
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Logo size={18} />
                    <span style={{ fontSize: "11px", color: C.textLight, fontWeight: 600 }}>Atomic Dashboard</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: C.green }} />
                    <span style={{ fontSize: "10px", color: C.green, fontWeight: 600 }}>LIVE</span>
                  </div>
                </div>

                <div style={{ padding: "22px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                    <div>
                      <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.08em", color: C.textLight, textTransform: "uppercase" }}>Revenue</div>
                      <div style={{ fontSize: "30px", fontWeight: 700, color: C.navy, marginTop: "2px" }}>$2.4M</div>
                    </div>
                    <div style={{ padding: "3px 9px", borderRadius: "100px", fontSize: "11px", fontWeight: 600, background: C.greenBg, color: C.green }}>↑ 18.3%</div>
                  </div>

                  {/* Bar chart matching logo style — gold particles into navy bars */}
                  <div style={{ display: "flex", gap: "4px", alignItems: "flex-end", marginTop: "22px", height: "100px" }}>
                    {[25, 35, 30, 45, 40, 55, 50, 65, 60, 78, 72, 92].map((h, i) => (
                      <div key={i} style={{
                        flex: 1, borderRadius: "2px 2px 0 0", height: `${h}%`,
                        background: i < 4 ? C.gold : i < 6 ? `linear-gradient(180deg, ${C.navyMid}, ${C.gold})` : C.navy,
                        opacity: i < 3 ? 0.4 + (i * 0.15) : 1,
                        transformOrigin: "bottom",
                      }} />
                    ))}
                  </div>

                  {/* AI Insight */}
                  <div style={{
                    marginTop: "14px", padding: "10px 12px", borderRadius: "8px",
                    background: C.goldBg2, border: `1px solid ${C.gold}18`,
                    display: "flex", alignItems: "flex-start", gap: "8px",
                  }}>
                    <span style={{ fontSize: "13px" }}>⚡</span>
                    <div>
                      <div style={{ fontSize: "10px", fontWeight: 700, color: C.gold, marginBottom: "1px" }}>AI INSIGHT</div>
                      <div style={{ fontSize: "11px", color: C.textMid, lineHeight: 1.5 }}>
                        Margins up 3.2% above forecast. Good time to accelerate Q2 hiring.
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                    {[
                      { l: "Margin", v: "34.2%", c: C.green },
                      { l: "Cash", v: "$480K", c: C.navy },
                      { l: "Pipeline", v: "$1.1M", c: C.gold },
                    ].map((m, i) => (
                      <div key={i} style={{
                        flex: 1, padding: "8px 10px", borderRadius: "8px",
                        background: C.bg, border: `1px solid ${C.borderLight}`,
                      }}>
                        <div style={{ fontSize: "9px", color: C.textLight, fontWeight: 500 }}>{m.l}</div>
                        <div style={{ fontSize: "14px", fontWeight: 700, color: m.c, marginTop: "2px" }}>{m.v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ PROBLEM ═══ */}
      <Section bg={C.cream}>
        <div style={{ maxWidth: "660px" }}>
          <Reveal>
            <Label>Sound Familiar?</Label>
            <h2 style={{
              fontFamily: "'Lora', serif", fontSize: "clamp(26px, 3.2vw, 38px)",
              fontWeight: 600, color: C.navy, lineHeight: 1.2, marginBottom: "24px",
            }}>Here's what we hear from every new client.</h2>
          </Reveal>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "14px", marginTop: "28px" }}>
          {[
            { q: "I don't really understand my numbers.", a: "Your accountant handles the taxes. Nobody helps you think." },
            { q: "Cash flow always surprises us.", a: "You find out about problems after they've already happened." },
            { q: "We're growing, but it feels chaotic.", a: "Revenue is up but you're not sure you're actually making money." },
            { q: "We know we need AI, but where do we start?", a: "A thousand tools, no time to evaluate, and no one to ask." },
          ].map((p, i) => (
            <Reveal key={i} delay={i * 0.06}>
              <Card>
                <p style={{
                  fontFamily: "'Lora', serif", fontSize: "16px", fontWeight: 500,
                  color: C.navy, fontStyle: "italic", marginBottom: "8px", lineHeight: 1.4,
                }}>"{p.q}"</p>
                <p style={{ fontSize: "14px", color: C.textLight, lineHeight: 1.6 }}>{p.a}</p>
              </Card>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.25}>
          <p style={{
            marginTop: "36px", fontSize: "17px", color: C.textMid, lineHeight: 1.8, maxWidth: "540px",
          }}>
            These aren't unusual problems. They're nearly universal.
            The good news: they're fixable — and you don't need to overhaul everything at once.
            You just need the right small changes in the right places. That's what atomic means.
          </p>
        </Reveal>
      </Section>

      {/* ═══ APPROACH ═══ */}
      <Section bg={C.white}>
        <div style={{ textAlign: "center", maxWidth: "620px", margin: "0 auto" }}>
          <Reveal>
            <Label>The Atomic Approach</Label>
            <h2 style={{
              fontFamily: "'Lora', serif", fontSize: "clamp(26px, 3.2vw, 38px)",
              fontWeight: 600, color: C.navy, lineHeight: 1.2, marginBottom: "16px",
            }}>Small, precise moves. Compounding results.</h2>
            <p style={{ fontSize: "17px", lineHeight: 1.8, color: C.textMid }}>
              We don't try to change everything overnight. We find the atomic-level changes —
              the fundamental building blocks — that compound into massive improvements.
            </p>
          </Reveal>
        </div>

        <div style={{ display: "flex", gap: "20px", marginTop: "52px", justifyContent: "center", flexWrap: "wrap" }}>
          {[
            { n: "1", t: "Get clear.", d: "We map your finances so you actually know what's going on. Cash flow, margins, KPIs — in plain English.", active: false },
            { n: "2", t: "Get strategic.", d: "We help you make the big calls — pricing, hiring, capital — with real numbers, not guesswork.", active: true },
            { n: "3", t: "Get automated.", d: "We build the AI tools, dashboards, and workflows that keep everything running without you.", active: false },
          ].map((s, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div style={{
                width: "300px", padding: "36px 28px", borderRadius: "12px",
                background: s.active ? C.navy : C.white,
                border: `1px solid ${s.active ? C.navy : C.border}`,
                boxShadow: s.active ? "0 14px 44px rgba(27,46,74,0.14)" : "none",
              }}>
                <div style={{
                  fontSize: "40px", fontWeight: 700, fontFamily: "'Lora', serif",
                  color: s.active ? C.gold : C.borderLight, marginBottom: "12px", lineHeight: 1,
                }}>{s.n}</div>
                <h3 style={{ fontSize: "20px", fontWeight: 600, color: s.active ? "#fff" : C.navy, marginBottom: "10px" }}>{s.t}</h3>
                <p style={{ fontSize: "14px", lineHeight: 1.7, color: s.active ? "rgba(255,255,255,0.65)" : C.textLight }}>{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ═══ SERVICES ═══ */}
      <Section id="services" bg={C.cream}>
        <Reveal>
          <Label>Services</Label>
          <h2 style={{
            fontFamily: "'Lora', serif", fontSize: "clamp(26px, 3.2vw, 38px)",
            fontWeight: 600, color: C.navy, lineHeight: 1.2, marginBottom: "10px",
          }}>Three things, done well.</h2>
          <p style={{ fontSize: "17px", lineHeight: 1.8, color: C.textMid, maxWidth: "500px", marginBottom: "40px" }}>
            Your finances inform strategy. Strategy drives systems. Systems create time and money.
          </p>
        </Reveal>

        <div className="g3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          {[
            {
              title: "Fractional CFO",
              subtitle: "The financial brain you've been missing.",
              color: C.gold,
              items: ["Financial strategy & planning", "Cash flow forecasting", "Capital allocation & budgeting", "KPI dashboards & scorecards", "Pricing & profitability analysis", "Board & investor reporting", "Acquisition analysis", "Capital raising support"],
            },
            {
              title: "AI Advisory",
              subtitle: "We cut through the noise for you.",
              color: C.navy,
              items: ["AI readiness assessment", "Tool selection & vetting", "AI reporting dashboards", "Automated financial reports", "AI meeting transcription", "Workflow automation", "CRM & pipeline automation", "Internal AI assistants"],
            },
            {
              title: "Data & Systems",
              subtitle: "The infrastructure that ties it together.",
              color: C.blue,
              items: ["Financial dashboards", "Business intelligence", "KPI frameworks", "Integrated financial models", "Operational scorecards", "Pipeline tracking", "Job costing systems", "Real-time data infrastructure"],
            },
          ].map((svc, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <Card style={{ height: "100%", padding: "30px 26px" }}>
                <h3 style={{ fontSize: "19px", fontWeight: 600, color: C.navy, marginBottom: "4px" }}>{svc.title}</h3>
                <p style={{ fontSize: "13px", color: svc.color, fontWeight: 600, marginBottom: "18px" }}>{svc.subtitle}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {svc.items.map((item, j) => (
                    <div key={j} style={{ fontSize: "14px", color: C.textMid, display: "flex", alignItems: "center", gap: "9px" }}>
                      <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: svc.color, opacity: 0.5, flexShrink: 0 }} />
                      {item}
                    </div>
                  ))}
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ═══ AI QUIZ CTA ═══ */}
      <Section bg={C.white} style={{ padding: "56px 24px" }}>
        <Reveal>
          <div style={{
            padding: "40px 36px", borderRadius: "14px",
            background: `linear-gradient(135deg, ${C.goldBg}, ${C.goldBg2})`,
            border: `1px solid ${C.gold}18`,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexWrap: "wrap", gap: "24px",
          }}>
            <div style={{ maxWidth: "460px" }}>
              <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", color: C.gold, textTransform: "uppercase", marginBottom: "8px" }}>Free — 2 Minutes</div>
              <h3 style={{ fontFamily: "'Lora', serif", fontSize: "22px", fontWeight: 600, color: C.navy, marginBottom: "8px" }}>
                How ready is your business for AI?
              </h3>
              <p style={{ fontSize: "15px", color: C.textMid, lineHeight: 1.7 }}>
                Four questions. A plain-English score. And a clear picture of where to start.
              </p>
            </div>
            <Btn variant="navy" href="#" onClick={(e) => { e.preventDefault(); setAssessmentOpen(true); }}>Take the Quiz →</Btn>
          </div>
        </Reveal>
      </Section>

      {/* ═══ WHO IT'S FOR ═══ */}
      <Section bg={C.cream}>
        <div style={{ textAlign: "center", maxWidth: "580px", margin: "0 auto" }}>
          <Reveal>
            <Label>Who This Is For</Label>
            <h2 style={{
              fontFamily: "'Lora', serif", fontSize: "clamp(26px, 3.2vw, 38px)",
              fontWeight: 600, color: C.navy, lineHeight: 1.2, marginBottom: "14px",
            }}>
              Businesses doing <span style={{ color: C.gold }}>$1M to $30M</span>.
            </h2>
            <p style={{ fontSize: "17px", lineHeight: 1.8, color: C.textMid }}>
              Big enough to need real financial thinking. Small enough that you can't waste money figuring it out the hard way.
            </p>
          </Reveal>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "12px", marginTop: "40px" }}>
          {[
            { icon: "🏗️", label: "Contractors" },
            { icon: "🏢", label: "Real Estate" },
            { icon: "🔧", label: "Service Businesses" },
            { icon: "👤", label: "Founder-Led" },
            { icon: "👨‍👩‍👦", label: "Family Businesses" },
            { icon: "📈", label: "Growth-Stage SMBs" },
          ].map((t, i) => (
            <Reveal key={i} delay={i * 0.04}>
              <div style={{
                padding: "20px 14px", borderRadius: "10px", textAlign: "center",
                background: C.white, border: `1px solid ${C.borderLight}`,
              }}>
                <div style={{ fontSize: "22px", marginBottom: "6px" }}>{t.icon}</div>
                <div style={{ fontSize: "13px", fontWeight: 600, color: C.textMid }}>{t.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ═══ OUTCOMES ═══ */}
      <Section bg={C.navy} style={{ color: "#fff" }}>
        <div style={{ textAlign: "center" }}>
          <Reveal>
            <div style={{
              display: "inline-block", fontSize: "11px", fontWeight: 700,
              letterSpacing: "0.13em", textTransform: "uppercase",
              color: C.goldLight, marginBottom: "14px",
              padding: "5px 12px", borderRadius: "100px",
              background: `${C.gold}15`, border: `1px solid ${C.gold}25`,
            }}>What Changes</div>
            <h2 style={{
              fontFamily: "'Lora', serif", fontSize: "clamp(26px, 3.2vw, 38px)",
              fontWeight: 600, color: "#fff", lineHeight: 1.2, marginBottom: "48px",
            }}>Atomic changes. Outsized results.</h2>
          </Reveal>
        </div>

        <div className="g4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
          {[
            { n: 15, s: "%", l: "Average margin improvement" },
            { n: 80, s: "%", l: "Less time on reporting" },
            { n: 10, s: "x", l: "Faster financial visibility" },
            { n: 70, s: "%", l: "Cost savings in key areas" },
          ].map((m, i) => (
            <Reveal key={i} delay={i * 0.07}>
              <div style={{
                padding: "32px 18px", borderRadius: "10px", textAlign: "center",
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
              }}>
                <div style={{ fontSize: "42px", fontWeight: 700, color: C.goldLight, lineHeight: 1 }}>
                  <Ticker end={m.n} suffix={m.s} />
                </div>
                <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", marginTop: "10px" }}>{m.l}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ═══ CASE STUDIES ═══ */}
      <Section id="cases" bg={C.white}>
        <Reveal>
          <Label>Results</Label>
          <h2 style={{
            fontFamily: "'Lora', serif", fontSize: "clamp(26px, 3.2vw, 38px)",
            fontWeight: 600, color: C.navy, lineHeight: 1.2, marginBottom: "40px",
          }}>Small moves, big outcomes.</h2>
        </Reveal>

        <div className="g3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          {[
            {
              tag: "Construction", tagColor: C.gold,
              title: "General contractor improves margins by 15%",
              desc: "A $12M GC had no idea which jobs made money. We built a job costing system, put up real-time dashboards, and fixed the pricing. Two quarters later, margins went from 22% to 37%.",
              metrics: [{ l: "Margin Lift", v: "+15%" }, { l: "Reporting", v: "Automated" }],
            },
            {
              tag: "Real Estate", tagColor: C.navyMid,
              title: "Developer finally sees cash flow across 8 projects",
              desc: "Eight active projects, no consolidated view. We integrated the data, built forecasting models, and automated the monthly reports. Three days of work became three minutes.",
              metrics: [{ l: "Projects", v: "8" }, { l: "Report Time", v: "–99%" }],
            },
            {
              tag: "Services", tagColor: C.blue,
              title: "Service firm gets 15 hours back every week",
              desc: "A $5M firm was drowning in manual work. We set up AI meeting summaries, automated the financials, connected the CRM, and built a dashboard. The owner got her weekends back.",
              metrics: [{ l: "Time Saved", v: "15 hrs/wk" }, { l: "AI Tools", v: "6" }],
            },
          ].map((c, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <Card style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: c.tagColor, marginBottom: "12px" }}>{c.tag}</div>
                <h3 style={{ fontSize: "17px", fontWeight: 600, color: C.navy, marginBottom: "10px", lineHeight: 1.35 }}>{c.title}</h3>
                <p style={{ fontSize: "14px", lineHeight: 1.7, color: C.textLight, flex: 1 }}>{c.desc}</p>
                <div style={{ display: "flex", gap: "20px", marginTop: "18px", paddingTop: "16px", borderTop: `1px solid ${C.borderLight}` }}>
                  {c.metrics.map((m, j) => (
                    <div key={j}>
                      <div style={{ fontSize: "10px", color: C.textLight, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>{m.l}</div>
                      <div style={{ fontSize: "17px", fontWeight: 700, color: C.navy, marginTop: "2px" }}>{m.v}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ═══ ABOUT ═══ */}
      <Section id="about" bg={C.cream}>
        <div className="about-grid" style={{ display: "grid", gridTemplateColumns: "0.7fr 1.3fr", gap: "52px", alignItems: "center" }}>
          <Reveal>
            <div style={{
              aspectRatio: "4/5", borderRadius: "14px",
              background: `linear-gradient(160deg, ${C.goldBg}, ${C.bg})`,
              border: `1px solid ${C.border}`,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "36px",
            }}>
              <div style={{
                width: "200px", height: "200px", borderRadius: "50%", overflow: "hidden",
                border: "4px solid " + C.gold, boxShadow: "0 8px 24px rgba(27,42,74,0.12)", marginBottom: "18px",
              }}>
                <img src="/headshot.jpg" alt="JT Adlard" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
              </div>
              <div style={{ fontSize: "17px", fontWeight: 600, color: C.navy, marginBottom: "3px" }}>JT Adlard</div>
              <div style={{ fontSize: "13px", color: C.textLight }}>Founder, Atomic CFO</div>
              <div style={{ display: "flex", gap: "8px", marginTop: "18px" }}>
                {["LinkedIn", "Twitter"].map((s, i) => (
                  <a key={i} href="https://www.linkedin.com/in/jtadlard/" style={{
                    padding: "5px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: 500,
                    background: C.white, color: C.textMid, textDecoration: "none", border: `1px solid ${C.border}`,
                  }}>{s}</a>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
              <Label>About</Label>
              <h2 style={{
                fontFamily: "'Lora', serif", fontSize: "clamp(26px, 3vw, 34px)",
                fontWeight: 600, color: C.navy, lineHeight: 1.2, marginBottom: "20px",
              }}>I used to analyze companies for a living. Now I help run them.</h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "14px", fontSize: "16px", lineHeight: 1.8, color: C.textMid }}>
                <p>I spent years as a public markets investment analyst — picking apart balance sheets, studying capital allocation, figuring out which businesses were actually well-run and which ones just looked that way.</p>
                <p>I've worked with boards, executives, and investors. I've built models that informed millions in capital decisions. And the thing I kept seeing was simple: the businesses that won were the ones that understood their own numbers and had systems to act on them.</p>
                <p>Today I bring that same thinking to small and mid-sized businesses. But I don't just hand you a spreadsheet. I build the dashboards, the automations, the AI tools — the whole system that makes your business run on clarity instead of chaos.</p>
                <p style={{ color: C.navy, fontWeight: 600, fontFamily: "'Lora', serif", fontStyle: "italic" }}>
                  Big transformations start with atomic-level changes in the right places.
                </p>
              </div>

              <div style={{ display: "flex", gap: "7px", marginTop: "22px", flexWrap: "wrap" }}>
                {["CFA Charterholder", "Investment Analysis", "Capital Allocation", "Financial Modeling", "AI Implementation", "Automation", "SMB Strategy"].map((tag, i) => (
                  <span key={i} style={{
                    padding: "4px 11px", borderRadius: "100px", fontSize: "12px", fontWeight: 500,
                    background: C.white, color: C.textMid, border: `1px solid ${C.borderLight}`,
                  }}>{tag}</span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ═══ FINAL CTA ═══ */}
      <section style={{
        position: "relative", padding: "100px 24px", textAlign: "center",
        background: `linear-gradient(180deg, ${C.goldBg} 0%, ${C.white} 100%)`,
        borderTop: `1px solid ${C.borderLight}`,
      }}>
        <div style={{ maxWidth: "580px", margin: "0 auto" }}>
          <Reveal>
            <img src="/logo.png" alt="Atomic CFO" style={{ height: "44px" }} />
            <h2 style={{
              fontFamily: "'Lora', serif", fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 600, color: C.navy, lineHeight: 1.15, marginBottom: "16px", marginTop: "16px",
            }}>Ready to find your atomic advantage?</h2>
            <p style={{ fontSize: "17px", lineHeight: 1.75, color: C.textMid, marginBottom: "28px" }}>
              Book a free 30-minute call. We'll look at where you are, where you want to go,
              and which small changes will make the biggest difference. No pitch. Just a conversation.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <Btn>Book a Free Call →</Btn>
              <Btn variant="ghost" href="#" onClick={(e) => { e.preventDefault(); setAssessmentOpen(true); }}>Or Take the Quiz First</Btn>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer style={{ padding: "52px 24px 32px", borderTop: `1px solid ${C.borderLight}`, background: C.bg }}>
        <div style={{ maxWidth: "1060px", margin: "0 auto" }}>
          <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "36px", marginBottom: "36px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                <img src="/logo.png" alt="Atomic CFO" style={{ height: "24px" }} />
              </div>
              <p style={{ fontSize: "14px", lineHeight: 1.7, color: C.textLight, maxWidth: "240px" }}>
                Fractional CFO, AI advisory, and data systems for growing businesses. Based in Kansas City.
              </p>
            </div>
            {[
              { title: "Services", links: ["Fractional CFO", "AI Advisory", "Data Systems", "AI Quiz"] },
              { title: "Company", links: ["About", "Results", "Contact"] },
              { title: "Connect", links: ["LinkedIn", "Twitter", "Email"] },
            ].map((col, i) => (
              <div key={i}>
                <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", color: C.textLight, marginBottom: "12px", textTransform: "uppercase" }}>{col.title}</div>
                {col.links.map((l, j) => (
                  <a key={j} href="#" style={{ display: "block", fontSize: "14px", color: C.textMid, textDecoration: "none", marginBottom: "7px" }}>{l}</a>
                ))}
              </div>
            ))}
          </div>

          <div style={{
            paddingTop: "18px", borderTop: `1px solid ${C.borderLight}`,
            display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "10px",
          }}>
            <span style={{ fontSize: "13px", color: C.textLight }}>© 2026 Atomic CFO. All rights reserved.</span>
            <div style={{ display: "flex", gap: "16px" }}>
              {["Privacy", "Terms"].map((l, i) => (
                <a key={i} href="#" style={{ fontSize: "13px", color: C.textLight, textDecoration: "none" }}>{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
