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

  const onSelectPart = useCallback((id: PartId) => {
    setSelectedPartId(id)
    setRemovalIntent(false)
  }, [])

  const onToggleRemovalIntent = useCallback(() => {
    setRemovalIntent((v) => !v)
  }, [])

  const onClearSelection = useCallback(() => {
    setSelectedPartId(null)
    setRemovalIntent(false)
  }, [])

  const onAttemptRemove = useCallback((id: PartId): boolean => {
    const allMet = parts[id].requires.every(r => removedParts.has(r))
    if (!allMet) return false
    setRemovedParts(prev => new Set([...prev, id]))
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
      />
    </div>
  )
}

export default App
