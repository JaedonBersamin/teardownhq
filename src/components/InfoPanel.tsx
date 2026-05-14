import type { PartId } from '../data/deviceConfig'
import { parts } from '../data/deviceConfig'

type Props = {
  selectedPartId: PartId | null
  removalIntent: boolean
  onToggleRemovalIntent: () => void
  onClearSelection: () => void
}

export function InfoPanel({
  selectedPartId,
  removalIntent,
  onToggleRemovalIntent,
  onClearSelection,
}: Props) {
  const part = selectedPartId ? parts[selectedPartId] : null

  return (
    <aside className="info-panel" aria-label="Part details">
      <header className="info-panel__header">
        <h1 className="info-panel__brand">TeardownHQ</h1>
        <p className="info-panel__tagline">Fix it before you touch it.</p>
      </header>

      {!part ? (
        <p className="info-panel__empty">
          Click the iPhone 12 teardown model. Parts are grouped from GLB node names; screws listed below
          are examples until you anchor them to real coordinates.
        </p>
      ) : (
        <>
          <h2 className="info-panel__title">{part.title}</h2>
          <p className="info-panel__desc">{part.description}</p>

          <div className="info-panel__actions">
            <button type="button" className="btn btn--primary" onClick={onToggleRemovalIntent}>
              {removalIntent ? 'Hide screws for removal' : 'Show screws for removal'}
            </button>
            <button type="button" className="btn btn--ghost" onClick={onClearSelection}>
              Clear selection
            </button>
          </div>

          <section className="info-panel__section">
            <h3 className="info-panel__section-title">Tools for this step</h3>
            <ul className="info-panel__list">
              {part.tools.map((t) => (
                <li key={t.id}>
                  {t.purchaseUrl ? (
                    <a href={t.purchaseUrl} target="_blank" rel="noreferrer">
                      {t.label}
                    </a>
                  ) : (
                    <span>{t.label}</span>
                  )}
                  {!t.purchaseUrl ? (
                    <span className="info-panel__muted"> — add a link in toolsCatalog when ready</span>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>

          {removalIntent && part.screws.length > 0 ? (
            <section className="info-panel__section">
              <h3 className="info-panel__section-title">Screw notes (panel only for now)</h3>
              <p className="info-panel__muted" style={{ marginBottom: '0.5rem' }}>
                3D pins were tuned for the old placeholder. On the GLB, use this list as copy-only
                until screw positions are authored per mesh.
              </p>
              <ul className="info-panel__list">
                {part.screws.map((s) => (
                  <li key={s.id}>
                    <strong>{s.typeLabel}</strong>
                    <span className="info-panel__muted"> · {s.id}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {removalIntent && part.screws.length === 0 ? (
            <p className="info-panel__muted">No screw entries for this part in config yet.</p>
          ) : null}
        </>
      )}

      <footer className="info-panel__footer">
        <p className="info-panel__muted">
          Model: <code>iphone_12_teardown.glb</code> (CC-BY-4.0, Sketchfab — keep attribution in
          shipping app). Credit in README.
        </p>
      </footer>
    </aside>
  )
}
