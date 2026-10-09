import { cn } from '../../utils/cn'

interface Tab<T extends string> {
  value: T
  label: string
  count?: number
}

interface SegmentedTabsProps<T extends string> {
  tabs: Tab<T>[]
  value: T
  onChange: (value: T) => void
  label: string
}

export default function SegmentedTabs<T extends string>({ tabs, value, onChange, label }: SegmentedTabsProps<T>) {
  return (
    <div role="tablist" aria-label={label} className="inline-flex rounded-md border border-slate-200 bg-white p-1">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          role="tab"
          aria-selected={value === tab.value}
          onClick={() => onChange(tab.value)}
          className={cn(
            'rounded px-3 py-1.5 text-sm font-medium transition-colors',
            value === tab.value ? 'bg-brand-700 text-white' : 'text-slate-600 hover:bg-slate-100',
          )}
        >
          {tab.label}
          {tab.count !== undefined && <span className="ml-1.5 opacity-75">{tab.count}</span>}
        </button>
      ))}
    </div>
  )
}
