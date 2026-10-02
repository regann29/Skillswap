import { useState } from 'react'
import './App.css'

const STORAGE_KEY = 'swaps'

function readSwaps() {
  try {
    const storedSwaps = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]')

    if (!Array.isArray(storedSwaps)) return []

    return storedSwaps.filter(
      (swap) =>
        swap &&
        (typeof swap.id === 'string' || typeof swap.id === 'number') &&
        typeof swap.name === 'string' &&
        typeof swap.offer === 'string' &&
        typeof swap.want === 'string',
    )
  } catch {
    return []
  }
}

function App() {
  const [swaps, setSwaps] = useState(readSwaps)
  const [search, setSearch] = useState('')
  const [formValues, setFormValues] = useState({ name: '', offer: '', want: '' })
  const [formError, setFormError] = useState('')
  const [storageError, setStorageError] = useState(false)

  function saveSwaps(nextSwaps) {
    setSwaps(nextSwaps)

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSwaps))
      setStorageError(false)
    } catch {
      setStorageError(true)
    }
  }

  const query = search.trim().toLowerCase()
  const filteredSwaps = swaps.filter((swap) =>
    [swap.name, swap.offer, swap.want].some((value) =>
      value.toLowerCase().includes(query),
    ),
  )

  function handleSubmit(event) {
    event.preventDefault()
    const newSwap = {
      id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
      name: formValues.name.trim(),
      offer: formValues.offer.trim(),
      want: formValues.want.trim(),
    }

    if (!newSwap.name || !newSwap.offer || !newSwap.want) {
      setFormError('Please fill in all three fields.')
      return
    }

    saveSwaps([newSwap, ...swaps])
    setFormValues({ name: '', offer: '', want: '' })
    setFormError('')
  }

  function handleFieldChange(event) {
    const { name, value } = event.target
    setFormValues((currentValues) => ({ ...currentValues, [name]: value }))
    if (formError) setFormError('')
  }

  function removeSwap(id) {
    saveSwaps(swaps.filter((swap) => swap.id !== id))
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="SkillSwap Lite home">
          <span className="brand-mark" aria-hidden="true">S</span>
          <span>skillswap<span className="brand-lite">lite</span></span>
        </a>
        <span className="local-badge"><span /> Local community board</span>
      </header>

      <main id="top" className="page-content">
        <section className="intro" aria-labelledby="page-title">
          <p className="eyebrow">A LITTLE KNOW-HOW GOES A LONG WAY</p>
          <h1 id="page-title">Trade skills.<br /><span>Grow together.</span></h1>
          <p className="intro-copy">Share what you know. Find your next teacher.</p>
        </section>

        <div className="workspace">
          <section className="form-panel" aria-labelledby="form-title">
            <div className="section-heading">
              <span className="step-number">01</span>
              <div>
                <h2 id="form-title">Start a swap</h2>
                <p>Good things are better shared.</p>
              </div>
            </div>

            <form className="swap-form" onSubmit={handleSubmit}>
              <label htmlFor="name">Your name</label>
              <input
                id="name"
                name="name"
                autoComplete="name"
                maxLength={60}
                placeholder="e.g. Jordan Lee"
                value={formValues.name}
                onChange={handleFieldChange}
                required
              />

              <label htmlFor="offer">A skill you can teach</label>
              <input
                id="offer"
                name="offer"
                maxLength={80}
                placeholder="e.g. Sourdough baking"
                value={formValues.offer}
                onChange={handleFieldChange}
                required
              />

              <label htmlFor="want">A skill you want to learn</label>
              <input
                id="want"
                name="want"
                maxLength={80}
                placeholder="e.g. Beginner pottery"
                value={formValues.want}
                onChange={handleFieldChange}
                required
              />

              {formError && <p className="form-error" role="alert">{formError}</p>}
              <button className="submit-button" type="submit">
                Add your swap <span aria-hidden="true">+</span>
              </button>
            </form>
            <p className="privacy-note">No account needed. Your swaps stay in this browser.</p>
          </section>

          <section className="directory" aria-labelledby="directory-title">
            <div className="directory-heading">
              <div className="section-heading">
                <span className="step-number">02</span>
                <div>
                  <h2 id="directory-title">Open swaps</h2>
                  <p>Find a skill match in your community.</p>
                </div>
              </div>
              <span className="swap-count" aria-label={`${swaps.length} swaps`}>{swaps.length}</span>
            </div>

            <label className="search-box">
              <span className="search-symbol" aria-hidden="true" />
              <input
                type="search"
                aria-label="Search swaps by name or skill"
                placeholder="Search names and skills..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              {search && (
                <button
                  className="clear-search"
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setSearch('')}
                >
                  Clear
                </button>
              )}
            </label>

            {storageError && (
              <p className="storage-warning" role="status">
                Browser storage is unavailable. Changes may not be saved after you leave.
              </p>
            )}

            {filteredSwaps.length > 0 ? (
              <ul className="swap-list" aria-live="polite">
                {filteredSwaps.map((swap) => (
                  <li className="swap-card" key={swap.id}>
                    <div className="swap-card-top">
                      <h3>{swap.name}</h3>
                      <button
                        className="delete-button"
                        type="button"
                        aria-label={`Delete swap by ${swap.name}`}
                        onClick={() => removeSwap(swap.id)}
                      >
                        Delete
                      </button>
                    </div>
                    <div className="skill-line">
                      <span className="skill-label offer-label">TEACHES</span>
                      <span>{swap.offer}</span>
                    </div>
                    <div className="skill-line">
                      <span className="skill-label want-label">LEARNING</span>
                      <span>{swap.want}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="empty-state" aria-live="polite">
                <span className="empty-mark" aria-hidden="true">+</span>
                <h3>{search ? 'No matches just yet' : 'The first swap is yours'}</h3>
                <p>
                  {search
                    ? 'Try another name or skill to widen your search.'
                    : 'Add a skill you can teach and see who you might meet.'}
                </p>
              </div>
            )}
          </section>
        </div>
      </main>

      <footer className="footer">
        <span>SkillSwap Lite</span>
        <span>Small exchanges. Big ideas.</span>
      </footer>
    </div>
  )
}

export default App
