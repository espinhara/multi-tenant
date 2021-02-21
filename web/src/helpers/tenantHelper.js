import api from '../services/api';

export default{
    list(){
        return api.get('tenant/')
    }
}