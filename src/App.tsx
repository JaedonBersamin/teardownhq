import { useCallback, useState } from 'react'
import { DeviceCanvas } from './components/DeviceCanvas'
import { InfoPanel } from './components/InfoPanel'
import type { PartId } from './data/deviceConfig'
import { parts } from './data/deviceConfig'
import './App.css'

function App() {
  const [selectedPartId, setSelectedPartId] = useState<PartId | null>(null)
  const [removalIntent, setRemovalIntent] = useState(false)
  const [removedParts, setRemovedParts] = useState<Set<PartId>>(new Set())
  const [blockingPartIds, setBlockingPartIds] = useState<Set<PartId>>(new Set())

  const onSelectPart = useCallback((id: PartId) => {
    setSelectedPartId(id)
    setRemovalIntent(false)
    setBlockingPartIds(new Set())
  }, [])

  const onToggleRemovalIntent = useCallback(() => {
    setRemovalIntent((v) => !v)
  }, [])

  const onClearSelection = useCallback(() => {
    setSelectedPartId(null)
    setRemovalIntent(false)
    setBlockingPartIds(new Set())
  }, [])

  const onAttemptRemove = useCallback((id: PartId): boolean => {
    const unmet = parts[id].requires.filter(r => !removedParts.has(r))
    if (unmet.length > 0) {
      setBlockingPartIds(new Set(unmet as PartId[]))
      return false
    }
    setBlockingPartIds(new Set())
    const toRemove = new Set([...removedParts, id])
    if (id === 'front_panel') {
      toRemove.add('front_panel_screw01')
      toRemove.add('front_panel_screw02')
      toRemove.add('front_panel_screw03')
      toRemove.add('front_panel_screw04')
    }
    setRemovedParts(toRemove)
    return true
  }, [removedParts])

  return (
    <div className="app-shell">
      <InfoPanel
        selectedPartId={selectedPartId}
        removalIntent={removalIntent}
        onToggleRemovalIntent={onToggleRemovalIntent}
        onClearSelection={onClearSelection}
      />
      <DeviceCanvas
        selectedPartId={selectedPartId}
        removalIntent={removalIntent}
        onSelectPart={onSelectPart}
        removedParts={removedParts}
        onAttemptRemove={onAttemptRemove}
        blockingPartIds={blockingPartIds}
      />
    </div>
  )
}

export default App
