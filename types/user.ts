export interface UserData {
  id: number
  firstName: string
  lastName: string
  maidenName: string
  age: number
  gender: string
  email: string
  phone: string
  username: string
  password?: string
  birthDate: string
  image: string
  bloodGroup: string
  height: number
  weight: number
  eyeColor: string
  hair: {
    color: string
    type: string
  }
  address: {
    address: string
    city: string
    state: string
    stateCode: string
    postalCode: string
    country: string
  }
  university: string
  company: {
    name: string
    department: string
    title: string
  }
  ein: string
  ssn: string
  userAgent: string
  role: string
  status?: string
}

export interface UsersResponse {
  users: UserData[]
  total: number
  skip: number
  limit: number
}

export interface UserFormData {
  firstName: string
  lastName: string
  maidenName: string
  age: number
  gender: string
  email: string
  phone: string
  username: string
  password: string
  birthDate: string
  image: string
  bloodGroup: string
  height: number
  weight: number
  eyeColor: string
  hair: {
    color: string
    type: string
  }
  address: {
    address: string
    city: string
    state: string
    stateCode: string
    postalCode: string
    country: string
  }
  university: string
  company: {
    name: string
    department: string
    title: string
  }
  ein: string
  ssn: string
  userAgent: string
  role: string
  status: string
}

export interface UserFilters {
  gender?: string
  minAge?: number
  maxAge?: number
  role?: string
  status?: string
  search?: string
}
