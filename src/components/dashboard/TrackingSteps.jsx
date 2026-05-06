const STEPS = [
  { key: 'PAGO_REALIZADO', label: 'Pago realizado' },
  { key: 'PAGO_VALIDADO',  label: 'Pago validado'  },
  { key: 'EN_CAMINO',      label: 'En camino'       },
  { key: 'ENTREGADO',      label: 'Entregado'       },
]

/**
 * TrackingSteps — barra de progreso de 4 estados de una donación
 */
export default function TrackingSteps({ status }) {
  const currentIdx = STEPS.findIndex(s => s.key === status)

  return (
    <div className="flex items-center w-full">
      {STEPS.map((step, i) => {
        const done   = i <= currentIdx
        const active = i === currentIdx
        const last   = i === STEPS.length - 1

        return (
          <div key={step.key} className="flex items-center flex-1 last:flex-none">
            {/* Dot + label */}
            <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
              <div className={`w-3 h-3 rounded-full border-2 transition-all
                ${active  ? 'border-green-500 bg-green-500 shadow-[0_0_0_3px_rgba(34,197,94,.2)]' :
                  done    ? 'border-green-500 bg-green-500' :
                            'border-gray-300 bg-white'}`}
              />
              <span className={`text-[10px] text-center leading-tight max-w-[60px]
                ${done ? 'text-green-700 font-medium' : 'text-gray-400'}`}>
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {!last && (
              <div className={`flex-1 h-0.5 mx-1 mb-4 transition-colors
                ${i < currentIdx ? 'bg-green-500' : 'bg-gray-200'}`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
