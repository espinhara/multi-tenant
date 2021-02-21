import api from '../services/api'

export default{
    list(tenant){
        return api.get(`${tenant}/users`)
    },
    listFrom(tenant){
        return api.get(`users/${tenant}`)
    }
}