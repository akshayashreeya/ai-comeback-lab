import { useState } from 'react';
import { BrainCircuit, Bug, Mic2, RotateCcw, CircleCheck } from 'lucide-react';
import './PracticeStudio.css';

const quiz = [
  { question: 'A hospital adds a new service. What is the best first approach to update a RAG chatbot?', options: ['Retrain the LLM from scratch', 'Update verified documents and re-index their chunks', 'Increase the model temperature'], correct: 1, why: 'RAG retrieves external knowledge. Updating and re-indexing the source keeps model weights unchanged.' },
  { question: 'The new document is indexed, but answers are still outdated. What should you inspect first?', options: ['The passages actually returned by retrieval', 'The chatbot button color', 'The GPU brand'], correct: 0, why: 'Inspecting retrieved passages shows whether the system is supplying fresh, relevant evidence.' },
  { question: 'What does a vector database typically store for RAG?', options: ['Only the model weights', 'Searchable embeddings alongside text and metadata', 'Only finished chatbot answers'], correct: 1, why: 'Embeddings enable similarity search, while text and metadata provide the evidence and filters.' },
];
const scenarios = [
  { title: 'The stale cardiology answer', prompt: 'The hospital published a verified service update yesterday. The chatbot still says the service is unavailable. Search results show only last month’s announcement.', options: ['Check the ingestion job, index freshness, and metadata filters', 'Fine-tune the LLM immediately', 'Increase response length'], correct: 0, why: 'The retriever is returning stale evidence. Check indexing, old chunks, and filters before changing the model.' },
  { title: 'The wrong branch', prompt: 'A patient asks about the Trichy branch, but the chatbot quotes a Chennai announcement. Both documents are indexed.', options: ['Remove all Chennai content', 'Apply branch-aware metadata filtering and test retrieval', 'Raise the temperature'], correct: 1, why: 'Branch metadata and retrieval filters help ensure the answer uses evidence for the correct location.' },
];
const prompts = [
  { question: 'Explain RAG to a non-technical hospital manager in under 45 seconds.', guide: 'Mention trusted documents, search at question time, and why updates do not require retraining. Give one hospital example.' },
  { question: 'How would you debug a RAG chatbot that gives an outdated answer?', guide: 'Walk through document freshness, ingestion, index status, retrieval results, caches, and prompt/context use.' },
];
const storageKey = 'ai-comeback-practice-v1';
function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
    return { quizAnswers: saved.quizAnswers || {}, scenarioAnswers: saved.scenarioAnswers || {}, interviewDone: saved.interviewDone || {} };
  } catch { return { quizAnswers: {}, scenarioAnswers: {}, interviewDone: {} }; }
}

export default function PracticeStudio() {
  const [mode, setMode] = useState('quiz');
  const [progress, setProgress] = useState(loadProgress);
  const [interviewNotes, setInterviewNotes] = useState('');
  const [showGuide, setShowGuide] = useState(false);
  const [promptIndex, setPromptIndex] = useState(0);
  const update = (key, index, value) => {
    const next = { ...progress, [key]: { ...progress[key], [index]: value } };
    setProgress(next);
    try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch { /* storage may be unavailable */ }
  };
  const correctCount = quiz.filter((q, i) => progress.quizAnswers[i] === q.correct).length;
  const answeredCount = Object.keys(progress.quizAnswers).length;
  const scenarioCount = Object.keys(progress.scenarioAnswers).length;
  const interviewCount = Object.values(progress.interviewDone).filter(Boolean).length;
  const resetQuiz = () => {
    const next = { ...progress, quizAnswers: {} };
    setProgress(next);
    try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch { /* storage may be unavailable */ }
  };
  return <section id="practice" className="panel practice-studio">
    <div className="section-top"><span className="eyebrow">02 / PRACTICE STUDIO</span><span className="chip">Hands-on learning</span></div>
    <h2>Think like an <span>AI engineer.</span></h2>
    <p className="intro">Practice the reasoning behind real RAG systems—one question at a time.</p>
    <div className="practice-summary" aria-label="Practice progress">
      <div><strong>{correctCount}/{quiz.length}</strong><small>Quiz correct</small></div>
      <div><strong>{scenarioCount}/{scenarios.length}</strong><small>Cases attempted</small></div>
      <div><strong>{interviewCount}/{prompts.length}</strong><small>Interview prompts done</small></div>
    </div>
    <div className="practice-modes" role="group" aria-label="Practice mode">
      <button type="button" className={mode==='quiz'?'selected':''} aria-pressed={mode==='quiz'} onClick={()=>setMode('quiz')}><BrainCircuit size={16}/> Knowledge quiz</button>
      <button type="button" className={mode==='debug'?'selected':''} aria-pressed={mode==='debug'} onClick={()=>setMode('debug')}><Bug size={16}/> Debugging lab</button>
      <button type="button" className={mode==='interview'?'selected':''} aria-pressed={mode==='interview'} onClick={()=>setMode('interview')}><Mic2 size={16}/> Interview room</button>
    </div>
    {mode==='quiz' && <div className="practice-body">
      <div className="practice-heading"><h3>RAG essentials</h3><span>{answeredCount} of {quiz.length} answered</span></div>
      {quiz.map((q, i) => { const answer = progress.quizAnswers[i]; const answered = answer !== undefined; return <div className="practice-question" key={q.question}>
        <div className="practice-number">QUESTION {String(i+1).padStart(2,'0')}</div><h4>{q.question}</h4>
        <div className="practice-options">{q.options.map((option, j) => <button key={option} type="button" disabled={answered} className={'practice-option '+(answered && j===q.correct?'correct':'')+(answered && j===answer && j!==q.correct?' incorrect':'')} onClick={()=>update('quizAnswers',i,j)}>{String.fromCharCode(65+j)}. {option}</button>)}</div>
        {answered && <p className="practice-feedback" role="status"><b>{answer===q.correct?'✓ Correct!':'Not quite — here’s why:'}</b> {q.why}</p>}
      </div>; })}
      {answeredCount===quiz.length && <div className="practice-result"><CircleCheck size={18}/> Your score: {correctCount}/{quiz.length} <button type="button" onClick={resetQuiz}><RotateCcw size={14}/> Try again</button></div>}
    </div>}
    {mode==='debug' && <div className="practice-body"><div className="practice-heading"><h3>Investigate the failure</h3><span>Choose your first action</span></div>
      {scenarios.map((s,i)=>{const answer=progress.scenarioAnswers[i];const answered=answer!==undefined;return <div className="practice-question" key={s.title}><div className="practice-number">CASE {String(i+1).padStart(2,'0')}</div><h4>{s.title}</h4><p>{s.prompt}</p><div className="practice-options">{s.options.map((o,j)=><button key={o} type="button" disabled={answered} className={'practice-option '+(answered&&j===s.correct?'correct':'')+(answered&&j===answer&&j!==s.correct?' incorrect':'')} onClick={()=>update('scenarioAnswers',i,j)}>{o}</button>)}</div>{answered&&<p className="practice-feedback" role="status"><b>{answer===s.correct?'✓ Good diagnosis!':'Try this reasoning:'}</b> {s.why}</p>}</div>})}
    </div>}
    {mode==='interview' && <div className="practice-body"><div className="practice-heading"><h3>Explain it clearly</h3><span>No AI grading—practice at your pace</span></div>
      <div className="practice-question"><div className="practice-number">PROMPT {promptIndex+1} / {prompts.length}</div><h4>{prompts[promptIndex].question}</h4><label className="practice-notes-label" htmlFor="interview-notes">Your talking points (optional; not saved)</label><textarea id="interview-notes" value={interviewNotes} onChange={e=>setInterviewNotes(e.target.value)} placeholder="Try explaining it in your own words…" rows={4}/><button type="button" className="practice-link" onClick={()=>setShowGuide(!showGuide)}>{showGuide?'Hide':'Show'} answer checklist</button>{showGuide&&<p className="practice-feedback">{prompts[promptIndex].guide}</p>}<button type="button" className="practice-done" onClick={()=>update('interviewDone',promptIndex,!progress.interviewDone[promptIndex])}>{progress.interviewDone[promptIndex]?'✓ Practiced — mark incomplete':'Mark as practiced'}</button></div>
      <div className="practice-switch"><button type="button" disabled={promptIndex===0} onClick={()=>{setPromptIndex(i=>i-1);setInterviewNotes('');setShowGuide(false)}}>Previous</button><button type="button" disabled={promptIndex===prompts.length-1} onClick={()=>{setPromptIndex(i=>i+1);setInterviewNotes('');setShowGuide(false)}}>Next prompt →</button></div>
    </div>}
    <p className="practice-footnote">Quiz answers, scenario attempts, and interview completion are saved locally in this browser.</p>
  </section>;
}
