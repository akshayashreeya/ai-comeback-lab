import { useState } from 'react';
import { BookOpen, BrainCircuit, BriefcaseBusiness, ChevronRight, CircleCheck, Code2, GraduationCap, LayoutDashboard, MoonStar, Sparkles, Target, Workflow } from 'lucide-react';
import './App.css';
import PracticeStudio from './PracticeStudio';

const modules = [
  { name: 'LLM Foundations', detail: 'Tokens, prompts and model behavior', status: 'Upcoming', icon: BrainCircuit },
  { name: 'Embeddings & RAG', detail: 'How knowledge reaches an LLM', status: 'Practicing', icon: Workflow },
  { name: 'RAG Debugging', detail: 'Fix stale or irrelevant answers', status: 'Next', icon: Code2 },
  { name: 'AI Agents & Tools', detail: 'Function calling and workflows', status: 'Upcoming', icon: Sparkles },
];


const architecture = {
  question: { emoji: '💬', title: 'User question', role: 'The starting point', meaning: 'A patient asks whether the hospital offers a new cardiology service.', example: '“Is the new cardiology service available at this branch?”', failure: 'An ambiguous question may need the branch name or a clarification.' },
  retriever: { emoji: '🔎', title: 'Retriever', role: 'Find evidence', meaning: 'The question is embedded and the system searches for relevant passages. It may apply filters such as branch, date, or document status.', example: 'Retrieves a verified announcement about the new service.', failure: 'Wrong collection, stale index, weak ranking, or incorrect filters can return old chunks.' },
  database: { emoji: '🗃️', title: 'Vector database', role: 'Store searchable knowledge', meaning: 'Stores vectors with the source text and metadata. New records are upserted; obsolete records should be removed or invalidated.', example: 'A chunk says the new service is available from November, with a branch ID and updated date.', failure: 'Old and new records may conflict, or the new document may not have been indexed.' },
  llm: { emoji: '🧠', title: 'LLM', role: 'Compose a grounded answer', meaning: 'The LLM receives the question, retrieved evidence, and instructions. It generates an answer using that context.', example: '“According to the latest service announcement, this branch offers the new service.”', failure: 'The context may be truncated, ignored, or overridden by a poorly designed prompt.' }
};

function InteractiveArchitecture() {
  const [selected, setSelected] = useState('retriever');
  const current = architecture[selected];
  return <div className="architecture-lab">
    <p className="architecture-instruction">✦ Click any component to explore what happens inside.</p>
    <div className="architecture-flow" aria-label="RAG question answering architecture">
      <button type="button" aria-pressed={selected==='question'} className={'architecture-node '+(selected==='question'?'chosen':'')} onClick={()=>setSelected('question')}><span>💬</span><b>Question</b><small>Patient asks</small></button>
      <span className="architecture-arrow" aria-hidden="true">→</span>
      <button type="button" aria-pressed={selected==='retriever'} className={'architecture-node '+(selected==='retriever'?'chosen':'')} onClick={()=>setSelected('retriever')}><span>🔎</span><b>Retriever</b><small>Search evidence</small></button>
      <span className="architecture-arrow" aria-hidden="true">→</span>
      <button type="button" aria-pressed={selected==='llm'} className={'architecture-node '+(selected==='llm'?'chosen':'')} onClick={()=>setSelected('llm')}><span>🧠</span><b>LLM</b><small>Answer with context</small></button>
    </div>
    <div className="architecture-connection" aria-hidden="true">↑ relevant chunks supplied to retriever ↑</div>
    <button type="button" aria-pressed={selected==='database'} className={'architecture-db '+(selected==='database'?'chosen':'')} onClick={()=>setSelected('database')}>🗃️ Vector database <small>Stored chunks · embeddings · metadata</small></button>
    <div className="architecture-detail" aria-live="polite">
      <div className="architecture-detail-heading"><span>{current.emoji}</span><div><small>{current.role}</small><h3>{current.title}</h3></div></div>
      <p>{current.meaning}</p>
      <div className="architecture-example"><b>🏥 Hospital example</b><p>{current.example}</p></div>
      <div className="architecture-risk"><b>⚠️ What could go wrong?</b><p>{current.failure}</p></div>
    </div>
    <div className="insight"><Sparkles size={17}/><span>The LLM isn't retrained. It receives up-to-date retrieved context at question time.</span></div>
  </div>;
}

function App() {
  const [activeTab, setActiveTab] = useState('workflow');
  const [showAnswer, setShowAnswer] = useState(false);
  const [done, setDone] = useState(() => localStorage.getItem('rag-lesson-done') === 'yes');
  const markDone = () => { const next = !done; setDone(next); localStorage.setItem('rag-lesson-done', next ? 'yes' : 'no'); };

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-icon"><MoonStar size={21} /></span><span>the comeback <b>lab.</b></span></div>
        <div className="nav-label">YOUR SPACE</div>
        <nav>
          <a className="nav-item active" href="#dashboard"><LayoutDashboard size={18}/> Dashboard</a>
          <a className="nav-item" href="#lesson"><BookOpen size={18}/> Learning studio</a>
          <a className="nav-item" href="#practice"><BrainCircuit size={18}/> Practice studio</a>
          <a className="nav-item" href="#roadmap"><Workflow size={18}/> Roadmap</a>
          <a className="nav-item" href="#career"><BriefcaseBusiness size={18}/> Career corner</a>
        </nav>
        <div className="sidebar-note"><Sparkles size={19}/><p>Little by little, you become the engineer you want to be.</p></div>
      </aside>

      <main id="dashboard" className="main">
        <div className="topbar"><span>PERSONAL AI ENGINEERING ACADEMY</span><span className="top-tag">✦ YOUR LEARNING SPACE</span></div>
        <header className="hero"><div className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</div><h1>Learn deeply.<br/><em>Build confidently.</em></h1><p>Real-world AI concepts, visual workflows and interview-ready thinking. One small lesson at a time.</p><a className="primary-btn" href="#lesson">Continue learning <ChevronRight size={17}/></a><div className="hero-glow"/></header>

        <div className="stats">
          <div className="stat"><span>LESSONS EXPLORED</span><strong>01</strong><small>You've started 🌱</small></div>
          <div className="stat"><span>YOUR FOCUS</span><strong>RAG</strong><small>Knowledge systems</small></div>
          <div className="stat"><span>LEARNING STATUS</span><strong>{done ? 'Done ✓' : 'In progress'}</strong><small>{done ? 'Lesson marked complete' : 'Practice makes progress'}</small></div>
        </div>

        <div className="content-grid">
          <section id="lesson" className="panel lesson">
            <div className="section-top"><span className="eyebrow">01 / INTERACTIVE LESSON</span><span className="chip">{done ? 'Completed' : 'Practicing'}</span></div>
            <h2>How does a chatbot learn <span>new information?</span></h2>
            <p className="intro">A hospital launches a new cardiology service. How do we update its chatbot without retraining the LLM?</p>
            <div className="tabs"><button className={activeTab==='workflow'?'selected':''} onClick={()=>setActiveTab('workflow')}>Architecture</button><button className={activeTab==='ingestion'?'selected':''} onClick={()=>setActiveTab('ingestion')}>Updating data</button><button className={activeTab==='compare'?'selected':''} onClick={()=>setActiveTab('compare')}>RAG vs tuning</button></div>
            {activeTab==='workflow' && <InteractiveArchitecture/>}
            {activeTab==='ingestion' && <div className="diagram"><div className="ingest-grid">{[['📄','Verified document'],['✂️','Split into chunks'],['🔢','Create embeddings'],['🗃️','Upsert vectors']].map(([emoji,text],i)=><div className="ingest-step" key={text}><span>{emoji}</span><b>{String(i+1).padStart(2,'0')}</b><p>{text}</p></div>)}</div><div className="insight"><Sparkles size={17}/><span>Remove or invalidate outdated chunks, then test whether retrieval finds the new ones.</span></div></div>}
            {activeTab==='compare' && <div className="diagram compare"><div><h3>📚 RAG</h3><p>Updates external knowledge. Model weights stay unchanged. Great for changing hospital details.</p></div><div><h3>🛠 Fine-tuning</h3><p>Further trains model parameters. Useful for some behaviors—not necessary for routine knowledge updates.</p></div></div>}
            <div className="challenge"><span className="eyebrow">THINK LIKE AN ENGINEER</span><h3>The chatbot still gives an outdated answer. Why?</h3><p>Think about indexing, old chunks, retrieval, caching and prompts.</p><button className="secondary-btn" onClick={()=>setShowAnswer(!showAnswer)}>{showAnswer ? 'Hide' : 'Reveal'} debugging checklist <ChevronRight size={16}/></button>{showAnswer && <ol className="answer"><li>Confirm the new document was indexed.</li><li>Check whether outdated chunks remain.</li><li>Inspect the passages returned by the retriever.</li><li>Check response and retrieval caches.</li><li>Verify the LLM is using the supplied context.</li></ol>}</div>
            <button className={'complete-btn '+(done?'completed':'')} onClick={markDone}><CircleCheck size={18}/>{done?'Lesson marked complete — undo':'Mark lesson as complete'}</button>
          </section>

          <div className="right-column"><section id="roadmap" className="panel roadmap"><span className="eyebrow">YOUR LEARNING PATH</span><h2>Roadmap <span>✦</span></h2>{modules.map((m,i)=>{const Icon=m.icon;return <div className="module" key={m.name}><div className="module-icon"><Icon size={18}/></div><div><b>{String(i+1).padStart(2,'0')}. {m.name}</b><small>{m.detail}</small></div><span className={'status '+m.status.toLowerCase()}>{m.status}</span></div>})}</section><section id="career" className="panel career"><div className="career-icon"><Target size={22}/></div><span className="eyebrow">THE BIGGER PICTURE</span><h2>Learning with a purpose.</h2><p>Build confidence for applied AI, automation and implementation roles—while turning your progress into portfolio evidence.</p><div className="goal"><GraduationCap size={17}/> Learn → Practice → Explain → Apply</div></section></div>
        </div>
        <PracticeStudio/>
        <footer>Made for curiosity, not perfection. ✦ Your progress is saved in this browser.</footer>
      </main>
    </div>
  );
}
export default App;
