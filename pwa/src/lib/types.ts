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
  loginCode: string
  invitees_id: number[]
}

export type Table = {
  id: number
  seats: number
  invitees_id: number[]
}
