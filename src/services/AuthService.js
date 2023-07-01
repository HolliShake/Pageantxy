import axiosIns from "@/plugins/axios"
import GenericService from "./GenericService"



class AuthService extends GenericService {
  constructor() {
    super()
  }
    
  async login(payload) {
    return axiosIns.post(this.baseUrl + '/login', payload)
      .then(res => this.success(res.data))
      .catch(err => {
        console.error(err)  
          
        return this.fail(err.response?.data)
      })
  }
    
  async register(payload) {
    return axiosIns.post(this.baseUrl + '/register', payload)
      .then(res => this.success(res.data))
      .catch(err => {
        console.error(err)  
          
        return this.fail(err.response?.data)
      })
  }
}


export default AuthService
