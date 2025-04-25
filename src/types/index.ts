export interface Customer {
  name: string,
  cellphone: string,
  email: string,
  taxId: string
}

export interface Payment {
  amount: number,
}

export interface Address {
  zipCode: string,
  street: string,
  number: string,
  complement: string,
  neighborhood: string,
  city: string,
  state: string
}