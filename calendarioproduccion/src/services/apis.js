import { API } from '../api/client'
export const fetchEvents = async ()=> (await API.get('/events')).data
export const createEvent = async (p)=> (await API.post('/events', p)).data
