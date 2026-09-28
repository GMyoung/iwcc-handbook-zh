import React, { useEffect, useMemo, useState } from 'react'
import lessons from './data.json'

const LANG = import.meta.env.VITE_SITE_LANG === 'en' ? 'en' : 'zh'
const isZh = LANG === 'zh'
const sibling = isZh ? 'https://gmyoung.github.io/iwcc-handbook-en/' : 'https://gmyoung.github.io/iwcc-handbook-zh/'
const original = 'https://iwcc.illinois.gov/content/dam/soi/en/web/iwcc/about/handbook/documents/handbook.pdf'
const current = 'https://iwcc.illinois.gov/content/dam/soi/en/web/iwcc/documents/handbook/IWCC%20handbook%2006.06.24.pdf'
const handbookIndex = 'https://iwcc.illinois.gov/about/handbook.html'
const benefitRates = 'https://iwcc.illinois.gov/resources/benefits.html'
const formPage = 'https://iwcc.illinois.gov/resources/forms.html'
const compfile = 'https://iwcc.illinois.gov/resources/resources-for-pro-se.html'
const courtCases = [
  {
    section: 5,
    name: 'Bryon Kawa · Ford Motor Company',
    citation: 'Kawa v. IWCC, 2013 IL App (1st) 120469WC',
    url: 'https://www.illinoiscourts.gov/Resources/08c9de1a-53d2-47fc-b8ea-7e0d35f55c33/1120469WC.pdf',
    zh: ['福特员工 Bryon Kawa 在工作相关事故后，肩、背及膝盖等症状和治疗发生争议。', '委员会认为部分后续治疗及康复不应支付，并争论其是否达到最大医疗改善。', '上诉法院撤销了因果关系、MMI、TTD、医疗与康复维持福利的部分结论，发回重审；平均周薪和罚款等部分维持。'],
    en: ['Ford employee Bryon Kawa disputed the treatment and work connection of shoulder, back, and knee conditions after an accident.', 'The Commission had denied parts of ongoing care and rehabilitation and found MMI.', 'The appellate court reversed and remanded the causation, MMI, TTD, medical, and rehabilitation rulings, while affirming the AWW and penalty rulings.']
  },
  {
    section: 6,
    name: 'Jeff Urban · Interstate Scaffolding',
    citation: 'Interstate Scaffolding v. IWCC, No. 107852 (Ill. 2010)',
    url: 'https://www.illinoiscourts.gov/files/107852.pdf/opinion',
    zh: ['木工 Jeff Urban 工伤后从事轻工作，后来因与伤情无关的行为被雇主解雇。', '雇主停止支付 TTD；委员会认为其伤情尚未稳定，仍应给付。', '伊州最高法院支持继续给付：因无关行为被解雇，不会自动终止工伤 TTD；关键仍是伤情是否达到最大医疗改善。'],
    en: ['Carpenter Jeff Urban worked light duty after his injury, then was dismissed for conduct unrelated to that injury.', 'The employer stopped TTD, although the Commission found his condition had not stabilized.', 'The Illinois Supreme Court held that unrelated dismissal did not automatically end TTD; maximum medical improvement remained central.']
  },
  {
    section: 8,
    name: 'Craig Kolin · W.B. Olson',
    citation: 'W.B. Olson v. IWCC, 2012 IL App (1st) 113129WC',
    url: 'https://www.illinoiscourts.gov/files/1113129wc.pdf/opinion',
    zh: ['Craig Kolin 膝部工伤后参加职业康复计划，雇主质疑计划及生活维持福利。', '委员会认可其康复努力，并要求雇主支付相关维持福利和辅导员服务费用。', '上诉法院维持该决定并发回后续程序；个案说明康复计划的合理性与实际参与证据很重要。'],
    en: ['After a knee injury, Craig Kolin took part in vocational rehabilitation; his employer challenged the plan and maintenance award.', 'The Commission credited his efforts and awarded maintenance and counselor costs.', 'The appellate court affirmed and remanded, emphasizing evidence that the rehabilitation plan and participation were reasonable.']
  }
]

const chapters = [
  ['制度与保障', 'Coverage & benefits', '先弄清谁受保护、什么算工伤、可获得哪些福利。', 'Start with coverage, work connection, and available benefits.'],
  ['报告伤害', 'Report an injury', '把通知、雇主响应和事故报告分清。', 'Separate employee notice from the employer’s accident report.'],
  ['正式立案', 'File a claim', '掌握 CompFile、申请期限与自愿付款。', 'Learn CompFile, filing limits, and voluntary payments.'],
  ['解决争议', 'Resolve a dispute', '看懂举证、审理、上诉、和解及执行。', 'Follow proof, hearings, review, settlements, and enforcement.'],
  ['医疗福利', 'Medical care', '治疗范围、选医生、账单与体检。', 'Explore covered care, provider choice, bills, and examinations.'],
  ['临时全残 TTD', 'Temporary total disability', '何时开始、如何计算、何时结束。', 'Know when TTD applies, how it is measured, and when it ends.'],
  ['临时部分失能 TPD', 'Temporary partial disability', '轻工作收入减少时怎样计算补差。', 'Calculate reduced earnings during light duty.'],
  ['职业康复', 'Vocational rehabilitation', '无法回原岗位时的再就业与维持福利。', 'Understand retraining and maintenance after loss of the old job.'],
  ['永久部分失能 PPD', 'Permanent partial disability', '比较四种评估路径和计算例子。', 'Compare four award paths and their example calculations.'],
  ['永久全残 PTD', 'Permanent total disability', '了解资格、长期给付与后续变更。', 'Learn eligibility, ongoing payment, and later modification.'],
  ['死亡与遗属', 'Death & survivors', '厘清丧葬费、受益人顺位和再婚影响。', 'See burial payments, beneficiary priority, and remarriage.']
]

const ui = {
  zh: { edition: '中文版', title: '工伤手册', subtitle: '逐条学', intro: '把 25 页官方手册变成 11 章、94 个能读懂和试一试的知识点。', search: '搜索 94 个问题', complete: '已掌握', mastered: '标记已掌握', done: '已掌握', next: '下一条', prev: '上一条', outline: '章节目录', lesson: '本条要点', try: '动手理解', play: '演示下一步', reset: '重新演示', historical: '展开 2013 年原文（历史资料）', source: '来源与核对', archive: '2013 原手册', update: '2024 官方修订版', official: 'IWCC 手册发布页', case: '真实判例', outcome: '查看法院原判决', all: '全部', count: '学习进度', warning: '这份附件印于 2013 年。纸质立案、旧网址及部分金额已经过时；具体行动请核对 IWCC 最新资料。', note: '教学演示只展示原理，金额未计法定上下限，不能作为个案计算结果。', inspect: '本条演示', stage: ['情境', '规则', '下一步'], mobileMenu: '目录', read: '阅读', sourceDate: '2026-09-28 核对官方发布页', empty: '没有找到匹配的问题。' },
  en: { edition: 'English edition', title: 'Work Comp', subtitle: 'field guide', intro: 'The 25-page official handbook, rebuilt as 11 chapters and 94 readable, interactive lessons.', search: 'Search 94 questions', complete: 'mastered', mastered: 'Mark as learned', done: 'Learned', next: 'Next lesson', prev: 'Previous', outline: 'Chapters', lesson: 'The rule in plain language', try: 'Try the idea', play: 'Next step', reset: 'Replay', historical: 'Read the 2013 original (historical)', source: 'Sources & verification', archive: '2013 handbook', update: '2024 official revision', official: 'IWCC handbook page', case: 'Real court case', outcome: 'Read the court opinion', all: 'All', count: 'Progress', warning: 'The supplied handbook was printed in 2013. Paper filing, old links, and some amounts are outdated. Check current IWCC material before acting.', note: 'Illustrations teach the principle. Calculators omit statutory minimums and maximums and are not case-specific awards.', inspect: 'Micro demonstration', stage: ['Situation', 'Rule', 'Next move'], mobileMenu: 'Chapters', read: 'Read', sourceDate: 'Official publication page checked 2026-09-28', empty: 'No matching questions.' }
}[LANG]

function NumberField({label, value, onChange, prefix = '$', min = 0, max = 100000}) {
  return <label className="number-field"><span>{label}</span><div><span>{prefix}</span><input type="number" min={min} max={max} step="any" value={value} onChange={e => onChange(Number(e.target.value))} /></div></label>
}

function Flow({labels}) {
  const [step,setStep] = useState(0)
  useEffect(() => setStep(0), [labels.join('|')])
  return <div className="flow-demo">
    <div className="flow-track">{labels.map((s,i) => <button key={s} className={`flow-node ${i<=step?'active':''}`} onClick={() => setStep(i)} aria-current={i===step?'step':undefined}><b>{String(i+1).padStart(2,'0')}</b><span>{s}</span></button>)}</div>
    <button className="demo-action" onClick={() => setStep((step+1)%labels.length)}>{step===labels.length-1?ui.reset:ui.play}<span aria-hidden="true">→</span></button>
  </div>
}

const scheduleDates = [
  ['Before 7/20/2005', '2005-07-20 to 2005-11-15', '2005-11-16 to 2006-01-31', '2006-02-01 to 2011-06-27', 'On or after 6/28/2011'],
  ['2005-07-20 前', '2005-07-20 至 11-15', '2005-11-16 至 2006-01-31', '2006-02-01 至 2011-06-27', '2011-06-28 起']
]
const scheduleParts = [
  ['Disfigurement','容貌损害',[150,162,150,162,162]],['Thumb','拇指',[70,76,70,76,76]],['Index finger','食指',[40,43,40,43,43]],['Middle finger','中指',[35,38,35,38,38]],['Ring finger','无名指',[25,27,25,27,27]],['Little finger','小指',[20,22,20,22,22]],['Great toe','大脚趾',[35,38,35,38,38]],['Other toe','其他脚趾',[12,13,12,13,13]],['Hand','手',[190,205,190,205,205]],['Arm','手臂',[235,253,235,253,253]],['Above-elbow amputation','肘上截肢',[250,270,250,270,270]],['Shoulder-joint amputation','肩关节截肢',[300,323,300,323,323]],['Foot','足',[155,167,155,167,167]],['Leg','腿',[200,215,200,215,215]],['Above-knee amputation','膝上截肢',[225,242,225,242,242]],['Hip-joint amputation','髋关节截肢',[275,296,275,296,296]],['Eye','眼',[150,162,150,162,162]],['Eye enucleation','摘除眼球',[160,173,160,173,173]],['Hearing loss, one ear','单耳听力损失',[50,54,50,54,54]],['Hearing loss, both ears','双耳听力损失',[200,215,200,215,215]],['One testicle','单侧睾丸',[50,54,50,54,54]],['Two testicles','双侧睾丸',[150,162,150,162,162]]
]

function PpdLab() {
  const [method,setMethod]=useState('scheduled')
  const [part,setPart]=useState(1)
  const [date,setDate]=useState(4)
  const [aww,setAww]=useState(500)
  const [loss,setLoss]=useState(10)
  const [oldPay,setOldPay]=useState(1040)
  const [newPay,setNewPay]=useState(500)
  const weeks=scheduleParts[part][2][date]
  const money=n=>new Intl.NumberFormat(isZh?'zh-CN':'en-US',{style:'currency',currency:'USD',maximumFractionDigits:2}).format(Math.max(0,n))
  const methods=isZh?[['scheduled','部位表'],['whole','整体身体'],['wage','工资差额'],['scar','容貌损害']]:[['scheduled','Body-part schedule'],['whole','Whole person'],['wage','Wage differential'],['scar','Disfigurement']]
  const result=method==='wage'?(oldPay-newPay)*2/3:method==='whole'?aww*.6*500*loss/100:aww*.6*(method==='scar'?scheduleParts[0][2][date]:weeks)*loss/100
  return <div className="lab-content"><div className="method-tabs">{methods.map(([key,label])=><button key={key} className={method===key?'active':''} onClick={()=>setMethod(key)}>{label}</button>)}</div>
    {(method==='scheduled'||method==='scar')&&<div className="fields"><label className="number-field"><span>{isZh?'受伤日期对应区间':'Injury-date bracket'}</span><select value={date} onChange={e=>setDate(Number(e.target.value))}>{scheduleDates[isZh?1:0].map((label,i)=><option value={i} key={i}>{label}</option>)}</select></label>{method==='scheduled'&&<label className="number-field"><span>{isZh?'身体部位':'Body part'}</span><select value={part} onChange={e=>setPart(Number(e.target.value))}>{scheduleParts.map((row,i)=><option key={i} value={i}>{isZh?row[1]:row[0]}</option>)}</select></label>}</div>}
    <div className="fields ppd-fields">{method==='wage'?<><NumberField label={isZh?'原岗位当前周薪':'Current old-job weekly pay'} value={oldPay} onChange={setOldPay}/><NumberField label={isZh?'新岗位周薪':'New-job weekly pay'} value={newPay} onChange={setNewPay}/></>:<><NumberField label={isZh?'平均周薪 AWW':'Average weekly wage'} value={aww} onChange={setAww}/><NumberField label={isZh?'失用或损害比例':'Loss percentage'} value={loss} onChange={setLoss} prefix="%" min={0} max={100}/></>}</div>
    {method!=='wage'&&<div className="ppd-weeks"><span>{isZh?'法定周数':'Scheduled weeks'}</span><strong>{method==='whole'?500:method==='scar'?scheduleParts[0][2][date]:weeks}</strong><span>× 60% AWW × {loss}%</span></div>}
    <div className="result-line"><span>{method==='wage'?(isZh?'示意每周金额':'Illustrative weekly amount'):(isZh?'示意总额':'Illustrative total')}</span><strong>{money(result)}</strong></div>
    <p>{method==='scheduled'?(isZh?'拇指、AWW $500、失用 10%、2011 年后受伤：76 周 × 10% × $300 = $2,280。重复性创伤腕管综合征另有 28.5–57 周范围，请看官方表。':'Thumb example: $500 AWW, 10% loss, post-2011 injury: 76 weeks × 10% × $300 = $2,280. Repetitive-trauma carpal tunnel has a separate 28.5–57-week range in the official table.'):method==='whole'?(isZh?'整体身体损失 10% 的原手册例子：500 周 × 10% × $300 = $15,000。':'The handbook’s 10% whole-person example: 500 weeks × 10% × $300 = $15,000.'):method==='wage'?(isZh?'原手册工资差额例子：$1,040 − $500 = $540；其三分之二为 $360／周。':'The handbook example: $1,040 − $500 = $540; two-thirds is $360 per week.'):(isZh?'同一身体部位的容貌损害与失用福利通常不能同时领取；结案前请核对适用条款。':'Disfigurement and loss-of-use awards for the same part generally cannot both be collected; check the applicable terms.')}</p>
  </div>
}

function ChapterDemo({item}) {
  const s = item.section
  const [day,setDay] = useState(12)
  const [ppp,setPpp] = useState(true)
  const [slots,setSlots] = useState(0)
  const [aww,setAww] = useState(s===9?500:900)
  const [lost,setLost] = useState(14)
  const [oldPay,setOldPay] = useState(s===9?1040:925)
  const [lightPay,setLightPay] = useState(500)
  const [mode,setMode] = useState('thumb')
  const [percent,setPercent] = useState(10)
  const [tier,setTier] = useState(0)
  const money = n => new Intl.NumberFormat(isZh?'zh-CN':'en-US',{style:'currency',currency:'USD',maximumFractionDigits:2}).format(Math.max(0,n))
  if (s===1) return <Flow labels={isZh?['发生工作相关伤病','判断雇佣关系与因果关系','匹配医疗及现金福利']:['Work-related harm','Check employment and causation','Match the benefit category']} />
  if (s===2) return <div className="lab-content"><div className="range-heading"><strong>{isZh?`第 ${day} 天通知雇主`:`Notice on day ${day}`}</strong><span>{day<=45?(isZh?'在一般 45 天界限内':'Within the general 45-day limit'):(isZh?'超过一般 45 天界限':'Past the general 45-day limit')}</span></div><input aria-label={isZh?'通知时间':'Day of notice'} type="range" min="0" max="60" value={day} onChange={e=>setDay(Number(e.target.value))} /><div className="range-ends"><span>0</span><span>45</span><span>60</span></div><p>{isZh?'尽快通知，并记录日期、地点；职业病与放射暴露另有规则。':'Report promptly with date and place; occupational disease and radiation exposure have different rules.'}</p></div>
  if (s===3) return <Flow labels={isZh?['注册 CompFile 账户','电子提交申请','跟进编号与状态日']:['Register for CompFile','File electronically','Track case number and status calls']} />
  if (s===4) return <Flow labels={isZh?['提出并证明争议要件','仲裁员审理或双方和解','复核、执行或结案']:['Prove the disputed elements','Arbitration or settlement','Review, enforce, or close']} />
  if (s===5) return <div className="lab-content"><div className="toggle-row"><span>{isZh?'雇主有 PPP 网络？':'Employer has a PPP?'}</span><button className="segmented" onClick={()=>{setPpp(!ppp);setSlots(0)}}>{ppp?(isZh?'有 · 网络内选择':'Yes · choose in network'):(isZh?'无 · 自选医疗机构':'No · choose providers')}</button></div><div className="provider-slots">{[0,1].map(i=><button key={i} className={i<slots?'filled':''} onClick={()=>setSlots(i+1)}>{i<slots?'✓':'+'}<small>{isZh?`选择 ${i+1}`:`Choice ${i+1}`}</small></button>)}</div><p>{isZh?'急救、急诊和符合规则的转诊通常不占这两个选择名额。':'Emergency care and qualifying referrals generally do not use one of the two choices.'}</p></div>
  if (s===6) return <div className="lab-content"><div className="fields"><NumberField label={isZh?'平均周薪 AWW':'Average weekly wage'} value={aww} onChange={setAww}/><NumberField label={isZh?'因伤缺勤日历天数':'Calendar days absent'} value={lost} onChange={setLost} prefix="" min={0} max={365}/></div><div className="result-line"><span>{isZh?'示意 TTD／周':'Illustrative TTD / week'}</span><strong>{money(aww*2/3)}</strong></div><p>{lost>=14?(isZh?'达到 14 个日历日：最初 3 个失去的工作日可能补付。':'At 14 calendar days: the first three lost workdays may become payable.'):(isZh?'未到 14 个日历日：最初 3 个失去的工作日通常不付。':'Under 14 calendar days: the first three lost workdays are generally unpaid.')}</p></div>
  if (s===7) return <div className="lab-content"><div className="fields"><NumberField label={isZh?'原岗位当前周薪':'Current pay of old job'} value={oldPay} onChange={setOldPay}/><NumberField label={isZh?'轻工作税前周薪':'Gross light-duty pay'} value={lightPay} onChange={setLightPay}/></div><div className="formula"><span>{money(oldPay)}</span><b>−</b><span>{money(lightPay)}</span><b>× ⅔</b></div><div className="result-line"><span>{isZh?'示意 TPD／周':'Illustrative TPD / week'}</span><strong>{money((oldPay-lightPay)*2/3)}</strong></div><p>{isZh?'预设为 2024 版手册的 $925 − $500 = $425；TPD $283.33／周例子。':'Defaults reproduce the 2024 handbook example: $925 − $500 = $425; TPD is $283.33 per week.'}</p></div>
  if (s===8) return <Flow labels={isZh?['无法回到原岗位','选择合理康复或再培训','维持福利与相关费用']:['Cannot return to old job','Reasonable retraining plan','Maintenance and incidental costs']} />
  if (s===9) return <PpdLab />
  if (s===10) return <Flow labels={isZh?['永久身体损失或完全失去工作能力','确定 PTD 资格与 AWW','按周给付并复核后续变化']:['Permanent qualifying loss or inability to work','Determine PTD and AWW','Weekly payment and later review']} />
  const labels=isZh?['配偶与未满 18 岁子女','完全依赖的父母','至少 50% 依赖的其他人']:['Spouse and children under 18','Totally dependent parents','Other people at least 50% dependent']
  return <div className="lab-content"><div className="tier-list">{labels.map((label,i)=><button key={label} className={tier===i?'active':''} onClick={()=>setTier(i)}><b>0{i+1}</b><span>{label}</span></button>)}</div><p>{isZh?'请从第一顺位开始判断；是否存在前一顺位会影响后一顺位。':'Start with the first priority; the existence of a higher tier affects who receives benefits.'}</p></div>
}

function MicroDemo({item}) {
  const [step,setStep] = useState(0)
  useEffect(()=>setStep(0),[item.id])
  const text = [isZh?item.zhTitle:item.enTitle, isZh?item.zhSummary:item.enSummary, isZh?'打开本条原文和现行手册核对细节。':'Check the original page and current handbook for details.']
  return <div className="micro-demo"><div className="micro-top"><span className="eyebrow">{ui.inspect}</span><span>{step+1} / 3</span></div><div className="micro-stage" key={`${item.id}-${step}`}><span className="stage-label">{ui.stage[step]}</span><p>{text[step]}</p></div><div className="micro-controls"><div className="dots">{[0,1,2].map(i=><button aria-label={`${ui.stage[i]} ${i+1}`} aria-current={step===i?'step':undefined} onClick={()=>setStep(i)} key={i} />)}</div><button className="text-button" onClick={()=>setStep((step+1)%3)}>{step===2?ui.reset:ui.play} →</button></div></div>
}

function CaseStudy({study}) {
  const [step,setStep] = useState(0)
  const story = isZh?study.zh:study.en
  return <section className="case-study"><div className="section-heading"><span className="eyebrow">{ui.case} · {study.citation}</span><a href={study.url} target="_blank" rel="noopener noreferrer">{ui.outcome} ↗</a></div><h3>{study.name}</h3><div className="case-steps">{story.map((line,i)=><button key={i} className={i===step?'active':''} onClick={()=>setStep(i)}><b>0{i+1}</b><span>{line}</span></button>)}</div><p className="case-focus">{story[step]}</p></section>
}

function App() {
  const parseHash=()=>{const match=window.location.hash.match(/lesson=([0-9]+\.[0-9]+)/);return lessons.some(x=>x.id===match?.[1])?match[1]:'1.1'}
  const [id,setId]=useState(parseHash)
  const [query,setQuery]=useState('')
  const [done,setDone]=useState(()=>{try{return JSON.parse(localStorage.getItem(`iwcc-${LANG}-done`)||'[]')}catch{return []}})
  const [font,setFont]=useState(()=>Number(localStorage.getItem(`iwcc-${LANG}-font`)||0))
  const [menu,setMenu]=useState(false)
  const item=lessons.find(x=>x.id===id)||lessons[0]
  const index=lessons.findIndex(x=>x.id===item.id)
  const chapter=chapters[item.section-1]
  const caseStudy=courtCases.find(x=>x.section===item.section)
  const visible=useMemo(()=>lessons.filter(x=>`${x.id} ${x.zhTitle} ${x.enTitle} ${x.zhSummary} ${x.enSummary}`.toLowerCase().includes(query.toLowerCase().trim())),[query])
  useEffect(()=>{const onHash=()=>setId(parseHash());window.addEventListener('hashchange',onHash);return()=>window.removeEventListener('hashchange',onHash)},[])
  useEffect(()=>localStorage.setItem(`iwcc-${LANG}-done`,JSON.stringify(done)),[done])
  useEffect(()=>localStorage.setItem(`iwcc-${LANG}-font`,String(font)),[font])
  function select(next) {setId(next);window.location.hash=`lesson=${next}`;setMenu(false);requestAnimationFrame(()=>document.querySelector('.reading-card')?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'}))}
  function toggleDone() {setDone(done.includes(id)?done.filter(x=>x!==id):[...done,id])}
  const allInChapter=lessons.filter(x=>x.section===item.section)
  const completed=allInChapter.filter(x=>done.includes(x.id)).length
  return <div className={`site font-${font}`}>
    <div className="top-ribbon"><span className="ribbon-dot" />{ui.warning}</div>
    <header className="site-header"><a className="brand" href="#lesson=1.1" onClick={()=>select('1.1')}><span className="brand-symbol">W<span>.</span></span><span><b>{ui.title}</b><small>{ui.subtitle}</small></span></a><div className="header-actions"><span className="edition">{ui.edition}</span><button className="font-control" onClick={()=>setFont((font+1)%3)} aria-label={isZh?'调整字体大小':'Adjust text size'} title={isZh?'调整字体大小':'Adjust text size'}>Aa<span>+</span></button><a className="language-link" href={`${sibling}#lesson=${id}`}>{isZh?'English edition':'中文版'} ↗</a><button className="mobile-menu" onClick={()=>setMenu(!menu)} aria-expanded={menu}>{ui.mobileMenu} ☰</button></div></header>
    <div className="layout">
      <aside className={`sidebar ${menu?'open':''}`}><div className="sidebar-intro"><span className="eyebrow">THE ILLINOIS FIELD GUIDE</span><h1>{ui.title}<em>{ui.subtitle}</em></h1><p>{ui.intro}</p><div className="overall-progress"><div><strong>{done.length}<span> / 94</span></strong><small>{ui.count}</small></div><div className="progress-bar"><i style={{width:`${done.length/94*100}%`}} /></div></div></div><label className="search"><span>⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={ui.search} /></label>{query&&<div className="search-results">{visible.slice(0,8).map(x=><button key={x.id} onClick={()=>{select(x.id);setQuery('')}}><b>{x.id}</b><span>{isZh?x.zhTitle:x.enTitle}</span></button>)}{visible.length===0&&<small>{ui.empty}</small>}</div>}<nav aria-label={ui.outline} className="chapter-nav">{chapters.map((c,i)=>{const count=lessons.filter(x=>x.section===i+1).length;return <button key={i} className={item.section===i+1?'active':''} onClick={()=>{const target=visible.find(x=>x.section===i+1);if(target)select(target.id);else if(!query)select(`${i+1}.1`)}}><b>{String(i+1).padStart(2,'0')}</b><span>{isZh?c[0]:c[1]}</span><small>{count}</small></button>})}</nav><footer className="sidebar-footer"><a href={handbookIndex} target="_blank" rel="noopener noreferrer">IWCC ↗</a><span>{ui.sourceDate}</span></footer></aside>
      <main id="main" className="main-content"><div className="breadcrumb"><span>{isZh?'学习路径':'LEARNING PATH'}</span><span className="slash">/</span><span>{String(item.section).padStart(2,'0')} · {isZh?chapter[0]:chapter[1]}</span></div><section className="chapter-head"><div><span className="chapter-number">{String(item.section).padStart(2,'0')}</span><h2>{isZh?chapter[0]:chapter[1]}</h2><p>{isZh?chapter[2]:chapter[3]}</p></div><div className="chapter-meter"><strong>{completed}<span> / {allInChapter.length}</span></strong><small>{ui.complete}</small><div className="progress-bar"><i style={{width:`${completed/allInChapter.length*100}%`}} /></div></div></section>
        <section className="lesson-index"><div className="section-heading"><div><span className="eyebrow">{isZh?'本章问题':'QUESTIONS IN THIS CHAPTER'}</span><h3>{isZh?'选一条开始学':'Choose a question'}</h3></div><span className="item-count">{visible.filter(x=>x.section===item.section).length} / {allInChapter.length}</span></div><div className="lesson-list">{visible.filter(x=>x.section===item.section).map(x=><button key={x.id} className={x.id===id?'selected':''} onClick={()=>select(x.id)}><span className="lesson-id">{x.id}</span><span>{isZh?x.zhTitle:x.enTitle}</span><b aria-label={done.includes(x.id)?ui.done:''}>{done.includes(x.id)?'✓':'↗'}</b></button>)}{!visible.some(x=>x.section===item.section)&&<p className="empty">{ui.empty}</p>}</div></section>
        <article className="reading-card"><div className="article-kicker"><span>{isZh?'问题':'QUESTION'} {item.id}</span><span>{isZh?'原手册 PDF': 'ORIGINAL PDF'} · P.{item.page}</span></div><h2>{isZh?item.zhTitle:item.enTitle}</h2><div className="lesson-summary"><span className="eyebrow">{ui.lesson}</span><p>{isZh?item.zhSummary:item.enSummary}</p></div><MicroDemo item={item}/><div className="article-actions"><button className={`mastered ${done.includes(id)?'on':''}`} onClick={toggleDone}>{done.includes(id) ? `✓ ${ui.done}` : `+ ${ui.mastered}`}</button><div><button disabled={index===0} onClick={()=>select(lessons[index-1].id)}>← {ui.prev}</button><button disabled={index===lessons.length-1} onClick={()=>select(lessons[index+1].id)}>{ui.next} →</button></div></div></article>
        <section className="lab-card"><div className="section-heading"><div><span className="eyebrow">INTERACTIVE LAB · 0{item.section}</span><h3>{ui.try}</h3></div><span className="lab-icon" aria-hidden="true">↗</span></div><ChapterDemo key={item.section} item={item}/><small className="lab-note">{ui.note}</small></section>
        {caseStudy&&<CaseStudy key={caseStudy.name} study={caseStudy}/>}
        <section className="sources-card"><span className="eyebrow">{ui.source}</span><div className="source-grid"><a href={`${original}#page=${item.page}`} target="_blank" rel="noopener noreferrer"><b>01</b><span>{ui.archive}<small>PDF · p.{item.page}</small></span>↗</a><a href={`${current}#page=${item.page}`} target="_blank" rel="noopener noreferrer"><b>02</b><span>{ui.update}<small>PDF · p.{item.page}</small></span>↗</a><a href={handbookIndex} target="_blank" rel="noopener noreferrer"><b>03</b><span>{ui.official}<small>iwcc.illinois.gov</small></span>↗</a>{[3,5,6,7,9,10,11].includes(item.section)&&<a href={item.section===3?compfile:item.section===5?formPage:benefitRates} target="_blank" rel="noopener noreferrer"><b>04</b><span>{item.section===3?'CompFile':item.section===5?(isZh?'当前表格':'Current forms'):(isZh?'当前福利费率':'Current benefit rates')}<small>iwcc.illinois.gov</small></span>↗</a>}</div><details className="original-text"><summary>{ui.historical}</summary><p>{item.historicAnswer}</p></details></section>
        <footer className="main-footer"><span>IWCC HANDBOOK · LEARNING EDITION</span><span>2013 → 2024</span></footer>
      </main>
    </div>
  </div>
}

export default App
