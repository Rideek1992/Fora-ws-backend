import axios from 'axios';

class StrapiService {
    async getOrderById(id: number) {
       const response = await axios.get(`/orders/${id}`)
    }
}