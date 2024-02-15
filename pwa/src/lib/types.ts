export type Invitee = {
  id: number
  firstname: string
  lastname: string
  email: string
  willCome: boolean
  food: string
  allergies: string
  tableId: number
  cardId: number
}

export type Card = {
  id: number
  userLoginId: string
  inviteeIds: number[]
}

export type Table = {
  id: number
  seats: number
  inviteeIds: number[]
}

export type User = {
  id: number
  username: string
  roles: string[]
}
