interface Bolt {
  id: string
  message: string
  created_at: string
  profiles: User
  liked: boolean
}

interface User {
  id: string
  email: string
  avatar_url: string
  full_name: string
  updated_at: string
  user_name: string
  welcomed: boolean
}

interface Language {
  label: string
  value: string
}

interface PWAInstallPrompt extends Event {
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
  prompt(): Promise<void>
}
