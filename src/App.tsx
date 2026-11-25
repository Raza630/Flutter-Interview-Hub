import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Bookmark, BookOpen, Check, CheckCheck, ChevronDown, ChevronLeft, ChevronRight, Circle, Clock3, Code2, Command, Copy, Menu, Moon, Search, Sun, X } from 'lucide-react';
import { Highlight, themes } from 'prism-react-renderer';
import { questions, type Category } from './data/questions';

const categories = [...new Set(questions.map(q => q.category))] as Category[];
const getStored = (key: string): number[] => { try { const value: unknown = JSON.parse(localStorage.getItem(key) || '[]'); return Array.isArray(value) ? value.filter((v): v is number => typeof v === 'number') : []; } catch { return []; } };

function App() {
  const [completed, setCompleted] = useState<number[]>(() => getStored('fih-completed'));
  const [bookmarks, setBookmarks] = useState<number[]>(() => getStored('fih-bookmarks'));
  const [theme, setTheme] = useState(() => localStorage.getItem('fih-theme') || 'dark');
  const [collapsed, setCollapsed] = useState(false); const [drawer, setDrawer] = useState(false);
  const [query, setQuery] = useState(''); const [category, setCategory] = useState<Category | 'All'>('All'); const [savedOnly, setSavedOnly] = useState(false);
  const location = useLocation(); const navigate = useNavigate();
  useEffect(() => { localStorage.setItem('fih-completed', JSON.stringify(completed)); }, [completed]);
  useEffect(() => { localStorage.setItem('fih-bookmarks', JSON.stringify(bookmarks)); }, [bookmarks]);
  useEffect(() => { localStorage.setItem('fih-theme', theme); document.documentElement.dataset.theme = theme; }, [theme]);
  useEffect(() => { setDrawer(false); window.scrollTo(0, 0); }, [location.pathname]);
  const toggle = (set: (v: number[] | ((old: number[]) => number[])) => void, id: number) => set(old => old.includes(id) ? old.filter(n => n !== id) : [...old, id]);
  const filtered = useMemo(() => questions.filter(q => (category === 'All' || q.category === category) && (!savedOnly || bookmarks.includes(q.id)) && (!query || `${q.id} ${q.title} ${q.category} ${q.keywords.join(' ')}`.toLowerCase().includes(query.toLowerCase()))), [category, query, savedOnly, bookmarks]);
  const select = () => setDrawer(false);
  return <div className="app-shell">
    {drawer && <button className="drawer-scrim" onClick={() => setDrawer(false)} aria-label="Close navigation"/>}
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${drawer ? 'drawer-open' : ''}`}>
      <div className="brand-row"><div className="brand-mark"><Code2 size={18}/></div>{!collapsed && <div className="brand-name">flutter<span>hub</span><small>INTERVIEW PREP</small></div>}<button className="icon-button collapse-btn" onClick={() => collapsed ? setCollapsed(false) : setCollapsed(true)} aria-label="Collapse sidebar"><ChevronLeft size={16}/></button></div>
      {!collapsed && <><button className="workspace-switch"><span className="workspace-dot"/> Learning workspace <ChevronDown size={14}/></button>
      <div className="search-wrap"><Search size={15}/><input aria-label="Search questions" placeholder="Search questions…" value={query} onChange={e => setQuery(e.target.value)}/><kbd>/</kbd></div>
      <div className="progress-card"><div className="progress-top"><span>YOUR PROGRESS</span><span>{completed.length}<i> / 50</i></span></div><div className="progress-track"><span style={{ width: `${completed.length * 2}%` }}/></div><div className="progress-bottom">{completed.length === 0 ? 'A fresh start. You’ve got this.' : `${Math.round(completed.length / 50 * 100)}% of your journey complete`}<span>{50 - completed.length} left</span></div></div>
      <div className="side-section"><div className="section-label">LIBRARY <span>{questions.length}</span></div><button className={`filter-item ${category === 'All' && !savedOnly ? 'selected' : ''}`} onClick={() => { setCategory('All'); setSavedOnly(false); }}><BookOpen size={15}/>All questions<span className="filter-count">50</span></button><button className={`filter-item ${savedOnly ? 'selected' : ''}`} onClick={() => setSavedOnly(v => !v)}><Bookmark size={15}/>Bookmarked<span className="filter-count">{bookmarks.length}</span></button></div>
      <div className="question-list-area"><div className="section-label category-label">TOPICS</div>{categories.map(cat => <div key={cat}><button className={`category-row ${category === cat ? 'category-active' : ''}`} onClick={() => setCategory(category === cat ? 'All' : cat)}><ChevronDown size={13}/><span>{cat}</span><span className="category-number">{questions.filter(q => q.category === cat).length}</span></button>{(category === 'All' || category === cat) && <div className="question-list">{filtered.filter(q => q.category === cat).map(q => <Link key={q.id} to={`/flutter-interview/${q.id}`} onClick={select} className={`question-item ${location.pathname === `/flutter-interview/${q.id}` ? 'active-question' : ''}`} title={q.title}><span className={`status-dot ${completed.includes(q.id) ? 'done' : ''}`}>{completed.includes(q.id) ? <Check size={10}/> : <Circle size={7} fill="currentColor"/>}</span><span className="question-item-title">{q.title}</span>{bookmarks.includes(q.id) && <Bookmark className="tiny-bookmark" size={11} fill="currentColor"/>}</Link>)}</div>}</div>)}</div>
      <div className="sidebar-footer"><div className="avatar">F</div><div className="profile-name">Your study space<small>50 questions · Flutter</small></div><button className="icon-button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Toggle theme">{theme === 'dark' ? <Sun size={16}/> : <Moon size={16}/>}</button></div></>}
      {collapsed && <div className="collapsed-tools"><button className="icon-button" onClick={() => setDrawer(true)} title="Search and browse"><Search size={16}/></button><button className="icon-button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} title="Toggle theme"><Sun size={16}/></button></div>}
    </aside>
    <div className="main-column"><header className="topbar"><button className="icon-button mobile-menu" onClick={() => setDrawer(true)} aria-label="Open navigation"><Menu size={19}/></button><div className="breadcrumbs"><span>Flutter Interview Hub</span><ChevronRight size={14}/><span className="crumb-current">Study guide</span></div><div className="top-actions"><span className="top-status"><span/>All progress saved</span><span className="top-divider"/><button className="icon-button top-theme" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Toggle theme">{theme === 'dark' ? <Sun size={16}/> : <Moon size={16}/>}</button><button className="icon-button" onClick={() => setCollapsed(v => !v)} aria-label="Toggle sidebar"><Command size={16}/></button></div></header>
      <Routes><Route path="/" element={<Navigate to="/flutter-interview/1" replace/>}/><Route path="/flutter-interview/:id" element={<QuestionPage completed={completed} bookmarks={bookmarks} toggleCompleted={id => toggle(setCompleted, id)} toggleBookmark={id => toggle(setBookmarks, id)} navigate={navigate}/>}/><Route path="*" element={<Navigate to="/flutter-interview/1" replace/>}/></Routes>
    </div>
    {drawer && <button className="drawer-close" onClick={() => setDrawer(false)} aria-label="Close navigation"><X size={18}/></button>}
  </div>;
}

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => { try { await navigator.clipboard.writeText(code); setCopied(true); window.setTimeout(() => setCopied(false), 1600); } catch { setCopied(false); } };
  return <div className="code-block"><div className="code-head"><span><i className="language-dot"/>{language}</span><button onClick={copy}><Copy size={13}/>{copied ? 'Copied!' : 'Copy code'}</button></div><Highlight theme={themes.vsDark} code={code} language={language}>{({ tokens, getLineProps, getTokenProps }) => <pre className="code-pre">{tokens.map((line, i) => <div key={i} {...getLineProps({ line })}><span className="line-no">{i + 1}</span><span>{line.map((token, key) => <span key={key} {...getTokenProps({ token })}/>)}</span></div>)}</pre>}</Highlight></div>;
}

function QuestionPage({ completed, bookmarks, toggleCompleted, toggleBookmark, navigate }: { completed: number[]; bookmarks: number[]; toggleCompleted: (id: number) => void; toggleBookmark: (id: number) => void; navigate: ReturnType<typeof useNavigate> }) {
  const { id: rawId } = useParams(); const id = Number(rawId); const q = questions.find(item => item.id === id);
  if (!q) return <main className="content-area"><div className="not-found"><h1>Question not found</h1><Link to="/flutter-interview/1">Return to the first question →</Link></div></main>;
  const previous = questions[id - 2]; const next = questions[id]; const done = completed.includes(id); const saved = bookmarks.includes(id);
  return <main className="content-area" key={id}><div className="reading-column"><div className="content-meta"><span className="eyebrow">FLUTTER INTERVIEW GUIDE</span><span className="meta-dot"/><span>Updated for Flutter 3</span></div><div className="question-kicker"><span className="q-number">QUESTION {String(id).padStart(2, '0')}</span><span className="kicker-line"/><span className="category-pill">{q.category}</span></div><h1 className="question-title">{q.title}</h1><div className="question-meta"><span className={`difficulty ${q.difficulty.toLowerCase()}`}><i/>{q.difficulty}</span><span><Clock3 size={14}/>{q.minutes} min read</span><span className="meta-separator"/><span>Updated Nov 2026</span></div><div className="action-row"><button className={`action-button ${saved ? 'bookmarked' : ''}`} onClick={() => toggleBookmark(id)}><Bookmark size={15} fill={saved ? 'currentColor' : 'none'}/>{saved ? 'Bookmarked' : 'Bookmark'}</button><button className={`action-button ${done ? 'completed-action' : ''}`} onClick={() => toggleCompleted(id)}>{done ? <CheckCheck size={15}/> : <Check size={15}/ >}{done ? 'Completed' : 'Mark as complete'}</button></div>
    <section className="answer-callout"><div className="callout-icon"><BookOpen size={16}/></div><div><div className="callout-label">THE SHORT ANSWER</div><p>{q.answer}</p></div></section>
    <section className="article-section"><SectionTitle icon="explain" title="In detail"/><p>{q.explanation}</p></section>
    {q.code && <section className="article-section"><SectionTitle icon="code" title="A practical example"/><CodeBlock code={q.code} language={q.language ?? 'dart'}/><p className="code-note"><span>↳</span>{q.codeNote}</p></section>}
    <section className="article-section"><SectionTitle icon="tip" title="Interview tip"/><div className="tip-box"><div className="tip-mark">✳</div><p>{q.tip}</p></div></section>
    <section className="article-section"><SectionTitle icon="mistake" title="Watch out for"/><div className="mistake-box"><span className="mistake-icon">!</span><p>{q.mistake}</p></div></section>
    <section className="article-section takeaways-section"><SectionTitle icon="takeaway" title="Key takeaways"/><ul className="takeaway-list">{q.takeaways.map((point, i) => <li key={i}><span><Check size={12}/></span>{point}</li>)}</ul></section>
    <div className="related-section"><div className="related-title">KEEP LEARNING <span>·</span> Related questions</div><div className="related-links">{q.related.map(rel => { const related = questions.find(item => item.id === rel); return related ? <Link to={`/flutter-interview/${related.id}`} key={rel}><span>Q{String(rel).padStart(2, '0')}</span>{related.title}<ChevronRight size={14}/></Link> : null; })}</div></div>
    <div className="bottom-navigation"><button className="nav-card previous" disabled={!previous} onClick={() => previous && navigate(`/flutter-interview/${previous.id}`)}><span><ChevronLeft size={13}/> PREVIOUS</span><strong>{previous?.title ?? 'You’re at the beginning'}</strong></button><button className="nav-card next" disabled={!next} onClick={() => next && navigate(`/flutter-interview/${next.id}`)}><span>NEXT <ChevronRight size={13}/></span><strong>{next?.title ?? 'You made it to the end!'}</strong></button></div>
    <footer className="article-footer"><span>Made for curious Flutter developers.</span><span>{id} <i>/</i> 50</span></footer></div></main>;
}
function SectionTitle({ icon, title }: { icon: 'explain' | 'code' | 'tip' | 'mistake' | 'takeaway'; title: string }) { const Icon = icon === 'code' ? Code2 : icon === 'tip' ? Command : icon === 'mistake' ? X : icon === 'takeaway' ? CheckCheck : BookOpen; return <h2 className={`section-title section-${icon}`}><span><Icon size={15}/></span>{title}</h2>; }

export default App;
