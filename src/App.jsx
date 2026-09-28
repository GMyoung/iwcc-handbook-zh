import React, { useEffect, useMemo, useState } from 'react'
import lessons from './data.json'
import { chapters, cases } from './chapters.js'
import { visuals } from './visuals.js'
import { quizzes } from './quizzes.js'
import { schedule } from './schedule.js'
import './styles.css'

const zh = import.meta.env.VITE_SITE_LANG !== 'en'
const sibling = zh ? 'https://gmyoung.github.io/iwcc-handbook-en/' : 'https://gmyoung.github.io/iwcc-handbook-zh/'
const handbook = 'https://iwcc.illinois.gov/content/dam/soi/en/web/iwcc/documents/handbook/IWCC%20handbook%2006.06.24.pdf'
const handbookPage = 'https://iwcc.illinois.gov/about/handbook.html'
const pick = (a,b) => zh ? a : b
const title = x => pick(x.zhTitle,x.enTitle)
const summary = x => pick(x.zhSummary,x.enSummary)
const detail = x => pick(x.zhDetail,x.enDetail)
const example = x => pick(x.zhExample,x.enExample)
const lessonId = id => `lesson-${id.replace('.','-')}`
const inChapter = n => lessons.filter(x => x.section === n)

function parseRoute() {
  const path = decodeURIComponent(window.location.hash.replace(/^#\/?/, ''))
  let m = path.match(/^chapter\/(\d+)(?:\/lesson\/(\d+\.\d+))?$/)
  if (m && +m[1]>=1 && +m[1]<=11) return {section:+m[1],target:m[2]||null}
  m = path.match(/^lesson[\/=](\d+\.\d+)$/)
  if (m) {
    const item=lessons.find(x=>x.id===m[1])
    if (item) return {section:item.section,target:item.id}
  }
  return {section:1,target:null}
}
function chapterUrl(section,target) { return `#/chapter/${section}${target?`/lesson/${target}`:''}` }
function navigate(section,target=null) {
  const next=chapterUrl(section,target)
  if (window.location.hash===next) {
    if (target) document.getElementById(lessonId(target))?.scrollIntoView({behavior:'smooth',block:'start'})
    else window.scrollTo({top:0,behavior:'smooth'})
  } else window.location.hash=next
}
function paragraphs(value) {
  if (zh) { const sentences=value.match(/[^。！？]+[。！？]?/g)||[value]; const out=[];for(let i=0;i<sentences.length;i+=2)out.push(sentences.slice(i,i+2).join(''));return out.filter(Boolean) }
  const sentences=value.split(/(?<=[.!?])\s+(?=[A-Z(])/)
  const out=[];let line=''
  for(const sentence of sentences){if(line.length+sentence.length>430&&line){out.push(line);line=''}line+=(line?' ':'')+sentence}
  if(line)out.push(line)
  return out
}

function RuleDiagram({item}) {
  const spec=visuals[item.id]
  if(!spec)return null
  const [type,z,e]=spec
  const nodes=(zh?z:e).split('|')
  const typeName={flow:pick('过程','Process'),timeline:pick('时间线','Timeline'),compare:pick('两种判断','Comparison'),split:pick('区分','Distinction'),stack:pick('要素','Elements'),formula:pick('计算关系','Formula'),decision:pick('判断路径','Decision path')}[type]
  return <figure className={`rule-diagram diagram-${type}`} aria-label={`${pick('图解','Diagram')}：${title(item)}`}>
    <figcaption><span className="diagram-symbol" aria-hidden="true">{type==='formula'?'ƒ':type==='timeline'?'◷':type==='decision'?'◇':type==='compare'||type==='split'?'⇄':'↗'}</span><span>{pick('图解','Visual guide')} · {typeName}</span></figcaption>
    <div className="diagram-nodes">{nodes.map((node,i)=><React.Fragment key={i}><div className="diagram-node"><span className="node-index">{String(i+1).padStart(2,'0')}</span><strong>{node}</strong></div>{i<nodes.length-1&&<span className="diagram-connector" aria-hidden="true">{type==='formula'?'＋':type==='compare'||type==='split'?'／':'→'}</span>}</React.Fragment>)}</div>
  </figure>
}
function ScheduleTable(){return <section className="schedule-section"><h3>{pick('法定部位周数表','Statutory body-part schedule')}</h3><p>{pick('先按事故日期选择列，再查部位。周数还要乘失用比例与适用周费率。','Choose the injury-date column, then the body part. Weeks are multiplied by the loss percentage and applicable weekly rate.')}</p><div className="table-scroll"><table><thead><tr><th>{pick('部位','Body part')}</th><th>&lt; 7/20/2005</th><th>7/20–11/15/2005</th><th>11/16/2005–1/31/2006</th><th>2/1/2006–6/27/2011</th><th>≥ 6/28/2011</th></tr></thead><tbody>{schedule.map(row=><tr key={row[0]}><th>{pick(row[1],row[0])}</th>{row.slice(2).map((v,i)=><td key={i}>{v}</td>)}</tr>)}</tbody></table></div><small>{pick('容貌损害：以上五列依次为 150、162、150、162、162 周。','Disfigurement: 150, 162, 150, 162, 162 weeks across the five columns.')} <a href={`${handbook}#page=23`} target="_blank" rel="noreferrer">{pick('手册第 23 页','Handbook p.23')} ↗</a></small></section>}
function CaseStudy({section}) { const c=cases[section]; if(!c)return null;return <aside className="case-study"><span>{pick('真实法院案例','Actual court case')}</span><h3>{c.name}</h3><p>{pick(c.zh,c.en)}</p><a href={c.url} target="_blank" rel="noreferrer">{c.cite} ↗</a></aside> }
function Source({item}) {return <div className="source-note"><span>{pick('依据','Source')}：</span><a href={`${handbook}#page=${item.sourcePage}`} target="_blank" rel="noreferrer">IWCC 2024 · PDF p.{item.sourcePage} ↗</a><span>·</span><a href={handbookPage} target="_blank" rel="noreferrer">{pick('发布页','Handbook page')} ↗</a></div>}

function Lesson({item,learned,onToggle}) {
  const isLearned=learned.includes(item.id)
  return <article className="lesson-block" id={lessonId(item.id)}>
    <div className="lesson-number"><span>{item.id}</span><span className="lesson-rule"/></div>
    <h2>{title(item)}</h2>
    <p className="lesson-lead">{summary(item)}</p>
    <div className="reading-prose">{paragraphs(detail(item)).map((p,i)=><p key={i}>{p}</p>)}</div>
    <RuleDiagram item={item}/>
    {item.id==='9.2'&&<ScheduleTable/>}
    <div className="example"><div className="example-label">{pick('具体情境','A concrete situation')} <span>· {pick('虚构教学例子','fictional teaching example')}</span></div><p>{example(item)}</p></div>
    {({'5.9':5,'6.2':6,'8.2':8})[item.id]&&<CaseStudy section={item.section}/>}
    <Source item={item}/>
    <div className="lesson-bottom"><button type="button" className={'learn-button '+(isLearned?'is-learned':'')} onClick={()=>onToggle(item.id)}>{isLearned?`✓ ${pick('已学会','Learned')}`:`＋ ${pick('我学会了','Mark as learned')}`}</button></div>
  </article>
}

function ChapterStory({chapter}) { const s=chapter.story,items=pick(s.zh,s.en);return <div className="chapter-story"><div className="story-caption"><span>{pick('这一章的人物线','The chapter story')}</span><strong>{pick(s.zhName,s.enName)}</strong></div><div className="story-points">{items.map((part,i)=><div key={i}><span>{String(i+1).padStart(2,'0')}</span><strong>{part[0]}</strong><p>{part[1]}</p></div>)}</div>{(chapter===chapters[5]||chapter===chapters[7])&&<a href={cases[chapters.indexOf(chapter)+1]?.url} target="_blank" rel="noreferrer">{pick('查看真实判决','Read the actual opinion')} ↗</a>}</div> }

function ChapterQuiz({section,onReview,onLearn,learned}) {
  const [open,setOpen]=useState(false)
  const [answers,setAnswers]=useState({})
  const list=quizzes[section]||[]
  return <section className="chapter-quiz" id="chapter-quiz"><div className="quiz-head"><div><span className="eyebrow">{pick('可选复习','Optional review')}</span><h2>{pick('试着回答两道题','Try two questions')}</h2><p>{pick('不答也可以继续下一章；答错时可直接回看对应规则。','You can continue without answering. A missed answer points back to its rule.')}</p></div><button type="button" onClick={()=>setOpen(!open)} aria-expanded={open}>{open?pick('收起练习','Hide questions'):pick('开始练习','Start practice')} {open?'↑':'→'}</button></div>
    {open&&<div className="quiz-list">{list.map((q,i)=>{const selected=answers[i];const done=selected!==undefined;return <div className="question" key={q.lesson}><span className="question-tag">{pick('题','Q')} {i+1} · {q.lesson}</span><h3>{pick(q.zhQ,q.enQ)}</h3><div className="question-options">{pick(q.zhOptions,q.enOptions).map((option,j)=><button type="button" key={j} className={done?(j===q.correct?'correct':j===selected?'incorrect':''):''} onClick={()=>setAnswers(prev=>({...prev,[i]:j}))}>{option}</button>)}</div>{done&&<div className={'answer-feedback '+(selected===q.correct?'right':'try-again')}><strong>{selected===q.correct?pick('答对了','That is right'):pick('再看一眼规则','Look at the rule again')}</strong><p>{pick(q.zhWhy,q.enWhy)}</p><div><button onClick={()=>onReview(q.lesson)}>{pick('回看','Review')} {q.lesson} ↗</button>{selected===q.correct&&!learned.includes(q.lesson)&&<button onClick={()=>onLearn(q.lesson)}>{pick('标记这条已学会','Mark this lesson learned')} ✓</button>}</div></div>}</div>})}</div>}
  </section>
}

function App() {
  const [route,setRoute]=useState(parseRoute)
  const [menu,setMenu]=useState(false)
  const [query,setQuery]=useState('')
  const [font,setFont]=useState(()=>Number(localStorage.getItem('iwcc-font')||1))
  const [learned,setLearned]=useState(()=>{try{return JSON.parse(localStorage.getItem('iwcc-learned')||'[]')}catch{return []}})
  const [showTop,setShowTop]=useState(false)
  useEffect(()=>{const handler=()=>{setRoute(parseRoute());setMenu(false)};window.addEventListener('hashchange',handler);return()=>window.removeEventListener('hashchange',handler)},[])
  useEffect(()=>{const timer=setTimeout(()=>{if(route.target)document.getElementById(lessonId(route.target))?.scrollIntoView({block:'start'});else window.scrollTo({top:0,behavior:'instant'})},40);return()=>clearTimeout(timer)},[route.section,route.target])
  useEffect(()=>{const handler=()=>setShowTop(window.scrollY>650);window.addEventListener('scroll',handler,{passive:true});return()=>window.removeEventListener('scroll',handler)},[])
  useEffect(()=>localStorage.setItem('iwcc-font',font),[font])
  useEffect(()=>localStorage.setItem('iwcc-learned',JSON.stringify(learned)),[learned])
  const section=route.section,chapter=chapters[section-1],group=inChapter(section)
  const learnedHere=group.filter(x=>learned.includes(x.id)).length
  const results=useMemo(()=>{const q=query.trim().toLowerCase();return q?lessons.filter(x=>[x.id,x.zhTitle,x.enTitle,x.zhSummary,x.enSummary,x.zhDetail,x.enDetail].join(' ').toLowerCase().includes(q)).slice(0,24):[]},[query])
  const toggle=id=>setLearned(prev=>prev.includes(id)?prev.filter(x=>x!==id):[...prev,id])
  const mark=id=>setLearned(prev=>prev.includes(id)?prev:[...prev,id])
  const jumpQuiz=()=>document.getElementById('chapter-quiz')?.scrollIntoView({behavior:'smooth',block:'start'})
  return <div className="site" style={{'--reader-scale':font}}>
    <header className="topbar"><button type="button" className="menu-button" onClick={()=>setMenu(!menu)} aria-label={menu?pick('关闭目录','Close chapters'):pick('打开目录','Open chapters')}>{menu?'✕':'☰'}</button><button className="brand" onClick={()=>navigate(1)}><span className="brand-mark">W<span>.</span></span><span><strong>{pick('伊利诺伊工伤手册','Illinois Work Comp Handbook')}</strong><small>{pick('2024 修订版 · 中文导读','2024 revision · reading edition')}</small></span></button><div className="top-actions"><span>{learned.length}/94 {pick('已学','learned')}</span><a href={sibling+window.location.hash}>{pick('English','中文')} ↗</a></div></header>
    <div className="shell">{menu&&<button type="button" className="scrim" onClick={()=>setMenu(false)} aria-label={pick('关闭目录','Close chapters')}/>}
      <aside className={'sidebar '+(menu?'open':'')}><div className="sidebar-label"><span>{pick('章节','Chapters')}</span><small>11 / 94</small></div><label className="search"><span>⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={pick('搜索知识点','Search lessons')}/>{query&&<button onClick={()=>setQuery('')}>×</button>}</label>{query?<div className="results"><p>{pick('搜索结果','Results')} · {results.length}</p>{results.map(item=><button key={item.id} onClick={()=>{navigate(item.section,item.id);setQuery('');setMenu(false)}}><small>{item.id}</small>{title(item)}</button>)}{results.length===0&&<p>{pick('没有匹配知识点','No matching lessons')}</p>}</div>:<nav className="chapter-nav">{chapters.map((c,i)=>{const n=i+1,done=inChapter(n).filter(x=>learned.includes(x.id)).length;return <button key={n} className={n===section?'active':''} onClick={()=>{navigate(n);setMenu(false)}}><span>{String(n).padStart(2,'0')}</span><strong>{pick(c.zh,c.en)}</strong><small>{done}/{inChapter(n).length}</small></button>})}</nav>}<div className="sidebar-bottom"><div className="progress-track"><span style={{width:`${learned.length/94*100}%`}}/></div>{pick('整体学习进度','Overall progress')} · {learned.length}/94</div></aside>
      <main className="main"><div className="chapter"><div className="chapter-top"><div className="chapter-kicker"><span>{String(section).padStart(2,'0')}</span><span>{pick('章','CHAPTER')}</span><i/></div><h1>{pick(chapter.zh,chapter.en)}</h1><p>{pick(chapter.zhIntro,chapter.enIntro)}</p><div className="chapter-meta"><span>{group.length} {pick('个知识点','lessons')}</span><span>·</span><span>{learnedHere} {pick('条已学会','learned')}</span><span className="meta-track"><i style={{width:`${learnedHere/group.length*100}%`}}/></span></div></div>
        <ChapterStory chapter={chapter}/>
        <div className="read-prompt"><span>↓</span><span>{pick('从这里开始，按顺序往下读。每条都可以独立标记学会。','Read straight down. Mark each lesson learned whenever you are ready.')}</span><button type="button" onClick={jumpQuiz}>{pick('本章可选练习：2 题','Optional chapter quiz: 2 questions')} ↘</button></div>
        <div className="continuous-lessons">{group.map(item=><Lesson key={item.id} item={item} learned={learned} onToggle={toggle}/>)}</div>
        <ChapterQuiz key={section} section={section} onReview={id=>navigate(section,id)} onLearn={mark} learned={learned}/>
        <div className="chapter-pager"><button disabled={section===1} onClick={()=>navigate(section-1)}>← {pick('上一章','Previous chapter')}</button><button disabled={section===11} onClick={()=>navigate(section+1)}>{pick('下一章','Next chapter')} →</button></div>
      </div><footer className="site-footer"><span>{pick('教学材料 · 个案须结合事实与现行法律','Educational material · cases depend on facts and current law')}</span><a href={handbookPage} target="_blank" rel="noreferrer">IWCC {pick('官方手册','official handbook')} ↗</a><div><span>{pick('字号','Text size')}</span><button onClick={()=>setFont(Math.max(.9,+(font-.1).toFixed(1)))}>A−</button><button onClick={()=>setFont(Math.min(1.3,+(font+.1).toFixed(1)))}>A+</button></div></footer></main>
    </div>{showTop&&<button type="button" className="back-top" onClick={()=>window.scrollTo({top:0,behavior:'smooth'})} aria-label={pick('回到章首','Back to chapter top')}>↑</button>}
  </div>
}
export default App
