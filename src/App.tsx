import { useCallback, useState } from 'react'
import { DeviceCanvas } from './components/DeviceCanvas'
import { InfoPanel } from './components/InfoPanel'
import type { PartId } from './data/deviceConfig'
import './App.css'

function App() {
  const [selectedPartId, setSelectedPartId] = useState<PartId | null>(null)
  const [removalIntent, setRemovalIntent] = useState(false)

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
      />
    </div>
  )
}

export default App
