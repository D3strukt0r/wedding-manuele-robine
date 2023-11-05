export type Invitee = {
  id: number
  firstname: string
  lastname: string
}

export type Card = {
  id: number
  loginCode: string
}

export type Table = {
  id: number
  seats: number
  invitees_id: number[]
}
