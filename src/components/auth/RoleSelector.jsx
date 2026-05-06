const ROLES = [
  { value: 'ROLE_DONANTE',      icon: '💙', label: 'Donante',      desc: 'Quiero donar' },
  { value: 'ROLE_BENEFICIARIO', icon: '🏠', label: 'Beneficiario', desc: 'Necesito ayuda' },
  { value: 'ROLE_EMPRESA',      icon: '🏢', label: 'Empresa',      desc: 'Donación empresarial' },
]

export default function RoleSelector({ value, onChange }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-gray-600">Tipo de cuenta</label>
      <div className="grid grid-cols-3 gap-2">
        {ROLES.map(role => (
          <button
            key={role.value}
            type="button"
            onClick={() => onChange(role.value)}
            className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border text-center transition-all
              ${value === role.value
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
          >
            <span className="text-xl">{role.icon}</span>
            <span className="text-xs font-medium">{role.label}</span>
            <span className="text-[10px] text-gray-400 leading-tight">{role.desc}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
