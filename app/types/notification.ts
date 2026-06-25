export interface AppNotification {
  id: number
  type: 'cotacao' | 'apolice' | 'renovacao' | 'sistema'
  title: string
  message: string
  time: string
  read: boolean
  icon: string
  iconBg: string
  iconColor: string
  link?: string
}
