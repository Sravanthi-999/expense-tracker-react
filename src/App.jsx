import { useMemo, useState } from 'react'
import { Wallet, TrendingDown, ReceiptText, Plus, Search, Trash2, CalendarDays, ArrowUpRight, ArrowDownRight, X, PieChart, LayoutDashboard } from 'lucide-react'

const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Education', 'Other']
const initial = [
  { id: 1, title: 'Weekly groceries', amount: 42.50, category: 'Food', date: '2026-11-04', note: 'Vegetables and essentials' },
  { id: 2, title: 'Bus pass', amount: 18.00, category: 'Transport', date: '2026-11-03', note: 'Monthly commute' },
  { id: 3, title: 'Coffee', amount: 5.20, category: 'Food', date: '2026-11-02', note: '' },
  { id: 4, title: 'Streaming subscription', amount: 9.99, category: 'Entertainment', date: '2026-11-01', note: 'Monthly plan' }
]
const money = n => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(n)
const readExpenses = () => {
  try { return JSON.parse(localStorage.getItem('spendwise-expenses')) ?? initial }
  catch { return initial }
}
const today = new Date().toISOString().slice(0, 10)

export default function App() {
  const [expenses, setExpenses] = useState(readExpenses)
  const [active, setActive] = useState('Overview')
  const [query, setQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [showForm, setShowForm] = useState(false)
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState({ title: '', amount: '', category: 'Food', date: today, note: '' })
  const [error, setError] = useState('')

  const save = next => { setExpenses(next); localStorage.setItem('spendwise-expenses', JSON.stringify(next)) }
  const total = expenses.reduce((s, e) => s + Number(e.amount), 0)
  const monthTotal = expenses.filter(e => e.date.slice(0, 7) === today.slice(0, 7)).reduce((s, e) => s + Number(e.amount), 0)
  const average = expenses.length ? total / expenses.length : 0
  const categoryTotals = useMemo(() => CATEGORIES.map(name => ({ name, total: expenses.filter(e => e.category === name).reduce((s, e) => s + Number(e.amount), 0) })).filter(x => x.total > 0).sort((a,b) => b.total-a.total), [expenses])
  const maxCategory = Math.max(1, ...categoryTotals.map(x => x.total))
  const filtered = expenses.filter(e => (categoryFilter === 'All' || e.category === categoryFilter) && `${e.title} ${e.note} ${e.category}`.toLowerCase().includes(query.toLowerCase())).sort((a,b) => b.date.localeCompare(a.date))

  function submit(e) {
    e.preventDefault()
    if (!form.title.trim() || !form.amount || Number(form.amount) <= 0 || !form.date) { setError('Enter a title, a valid amount above zero, and a date.'); return }
    const next = [{ ...form, id: Date.now(), amount: Number(form.amount), title: form.title.trim(), note: form.note.trim() }, ...expenses]
    save(next); setForm({ title: '', amount: '', category: 'Food', date: today, note: '' }); setError(''); setShowForm(false); setActive('Transactions')
  }
  function remove(id) { save(expenses.filter(e => e.id !== id)); setSelected(null) }

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark"><Wallet size={21}/></div><span>spend<span className="brand-light">wise</span></span></div>
      <div className="workspace-label">WORKSPACE</div>
      <nav>
        <button className={active === 'Overview' ? 'nav-item active' : 'nav-item'} onClick={() => setActive('Overview')}><LayoutDashboard size={18}/> Overview</button>
        <button className={active === 'Transactions' ? 'nav-item active' : 'nav-item'} onClick={() => setActive('Transactions')}><ReceiptText size={18}/> Transactions</button>
        <button className={active === 'Categories' ? 'nav-item active' : 'nav-item'} onClick={() => setActive('Categories')}><PieChart size={18}/> Categories</button>
      </nav>
      <div className="sidebar-bottom"><div className="avatar">S</div><div><strong>My workspace</strong><small>Personal account</small></div></div>
    </aside>

    <main className="main">
      <header className="topbar"><div><span className="eyebrow">PERSONAL FINANCE</span><h1>{active}</h1></div><button className="primary-btn" onClick={() => setShowForm(true)}><Plus size={17}/> Add expense</button></header>
      {active !== 'Categories' && <section className="stats-grid">
        <Stat icon={<Wallet/>} label="Total expenses" value={money(total)} tone="violet" hint="All recorded transactions"/>
        <Stat icon={<CalendarDays/>} label="This month" value={money(monthTotal)} tone="blue" hint="Spending this calendar month"/>
        <Stat icon={<ReceiptText/>} label="Transactions" value={expenses.length.toString()} tone="orange" hint="Total expense records"/>
        <Stat icon={<TrendingDown/>} label="Average expense" value={money(average)} tone="green" hint="Average per transaction"/>
      </section>}

      {active === 'Overview' && <div className="content-grid">
        <section className="panel category-panel"><div className="panel-heading"><div><h2>Spending by category</h2><p>Where your money is going</p></div><span className="soft-tag">Breakdown</span></div>
          {categoryTotals.length ? <div className="category-list">{categoryTotals.map(c => <div className="category-row" key={c.name}><div className="category-meta"><span>{c.name}</span><strong>{money(c.total)}</strong></div><div className="track"><div className="bar" style={{width: `${c.total/maxCategory*100}%`}}/></div></div>)}</div> : <Empty text="Add your first expense to see category insights."/>}
        </section>
        <section className="panel recent-panel"><div className="panel-heading"><div><h2>Recent expenses</h2><p>Your latest activity</p></div><button className="text-btn" onClick={() => setActive('Transactions')}>View all <ArrowUpRight size={15}/></button></div>
          {expenses.length ? expenses.slice().sort((a,b) => b.date.localeCompare(a.date)).slice(0,5).map(e => <ExpenseRow key={e.id} expense={e} onClick={() => setSelected(e)}/>) : <Empty text="No expenses yet. Add one to get started."/>}
        </section>
      </div>}

      {active === 'Transactions' && <section className="panel transactions-panel"><div className="panel-heading"><div><h2>All transactions</h2><p>Search, filter and review your expenses</p></div><span className="soft-tag">{filtered.length} records</span></div>
        <div className="filters"><div className="searchbox"><Search size={17}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search expenses..." /></div><select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}><option>All</option>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></div>
        {filtered.length ? filtered.map(e => <ExpenseRow key={e.id} expense={e} onClick={() => setSelected(e)}/>) : <Empty text="No matching expenses found."/>}
      </section>}

      {active === 'Categories' && <section className="panel category-full"><div className="panel-heading"><div><h2>Category overview</h2><p>Compare your spending across categories</p></div></div>{categoryTotals.length ? categoryTotals.map(c => <div className="category-row category-large" key={c.name}><div className="category-meta"><span>{c.name}</span><strong>{money(c.total)}</strong></div><div className="track"><div className="bar" style={{width: `${c.total/maxCategory*100}%`}}/></div></div>) : <Empty text="No category data yet. Add an expense to begin."/>}</section>}
      <footer>SpendWise <span>•</span> Your expenses are stored locally on this device.</footer>
    </main>

    {showForm && <div className="overlay" onMouseDown={e => e.target === e.currentTarget && setShowForm(false)}><section className="modal"><div className="modal-head"><div><span className="eyebrow">NEW RECORD</span><h2>Add an expense</h2></div><button className="icon-btn" onClick={() => setShowForm(false)}><X/></button></div>
      <form onSubmit={submit}><label>Expense title<input autoFocus value={form.title} onChange={e => setForm({...form,title:e.target.value})} placeholder="e.g. Lunch with friends" /></label><div className="form-row"><label>Amount (₹)<input type="number" min="0.01" step="0.01" value={form.amount} onChange={e => setForm({...form,amount:e.target.value})} placeholder="0.00"/></label><label>Category<select value={form.category} onChange={e => setForm({...form,category:e.target.value})}>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></label></div><label>Date<input type="date" value={form.date} onChange={e => setForm({...form,date:e.target.value})}/></label><label>Note <span className="optional">(optional)</span><textarea rows="3" value={form.note} onChange={e => setForm({...form,note:e.target.value})} placeholder="Add a short note..."/></label>{error && <p className="error">{error}</p>}<div className="modal-actions"><button type="button" className="secondary-btn" onClick={() => setShowForm(false)}>Cancel</button><button className="primary-btn" type="submit"><Plus size={16}/> Save expense</button></div></form>
    </section></div>}

    {selected && <div className="overlay" onMouseDown={e => e.target === e.currentTarget && setSelected(null)}><section className="modal detail-modal"><div className="modal-head"><div><span className="eyebrow">TRANSACTION DETAILS</span><h2>{selected.title}</h2></div><button className="icon-btn" onClick={() => setSelected(null)}><X/></button></div><div className="detail-amount">{money(selected.amount)}</div><div className="detail-list"><div><span>Category</span><strong>{selected.category}</strong></div><div><span>Date</span><strong>{selected.date}</strong></div><div><span>Note</span><strong>{selected.note || '—'}</strong></div></div><button className="delete-btn" onClick={() => remove(selected.id)}><Trash2 size={16}/> Delete transaction</button></section></div>}
  </div>
}

function Stat({icon,label,value,tone,hint}) { return <article className="stat-card"><div className={`stat-icon ${tone}`}>{icon}</div><span className="stat-label">{label}</span><strong className="stat-value">{value}</strong><small>{hint}</small></article> }
function ExpenseRow({expense,onClick}) { return <button className="expense-row" onClick={onClick}><div className="expense-symbol"><ReceiptText size={18}/></div><div className="expense-info"><strong>{expense.title}</strong><small>{expense.category} <span>•</span> {expense.date}</small></div><div className="expense-amount">−{money(expense.amount)}</div><ArrowUpRight className="row-arrow" size={16}/></button> }
function Empty({text}) { return <div className="empty-state"><div className="empty-icon"><ReceiptText size={22}/></div><p>{text}</p></div> }