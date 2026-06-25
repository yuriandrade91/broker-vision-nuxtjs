export interface ActionCardItem {
  id: string
  icon: string
  iconBg: string
  title: string
  description: string
  cta: string
  to: string
  variant: 'primary' | 'outline'
}

export interface MetricItem {
  id: string
  icon: string
  label: string
  value: string
  subtitle: string
  delta: number
}
