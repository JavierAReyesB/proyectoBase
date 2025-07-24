// lib/api.ts
import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://6880a9e9f1dcae717b62f854.mockapi.io',
  headers: {
    'Content-Type': 'application/json'
  }
})
