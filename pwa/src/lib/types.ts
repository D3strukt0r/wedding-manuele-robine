export type Invitee = {
  id: number
  firstname: string
  lastname: string
  email: string
  will_come: boolean
  food: string
  allergies: string
  table_id: number
  card_id: number
}

export type Card = {
  id: number
  user_login_id: string
  invitees_id: number[]
}

export type Table = {
  id: number
  seats: number
  invitees_id: number[]
}

export type User = {
  id: number
  username: string
  roles: string[]
}
