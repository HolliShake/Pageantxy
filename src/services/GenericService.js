import axiosIns from "@/plugins/axios"


const ResultType = Object.freeze({
  SUCCESS: 0,
  FAIL: 1,
})

class Result {

  constructor(type, data) {
    this.SUCCESS = (type == ResultType.SUCCESS)
    this.FAIL = (type == ResultType.FAIL)
    this.data = data  
  }
    
  toString() {
    return `${this.constructor.name}(type: ${this.type}, data: ${this.data}))`
  }
}

class GenericService {

  constructor() {
    this.context = this.constructor.name.replace('Service', '')
    this.baseUrl = `/api/${this.context}`
  }
    
  async getAll() {
    return axiosIns.get(this.baseUrl + '/all')
      .then(res => this.success(res.data))
      .catch(err => {
        console.error(err)
          
        return this.fail(err.response?.data)
      })
  }
    
  async getById(id) {
    return axiosIns.get(this.baseUrl + `/${id}`)
      .then(res => this.success(res.data))
      .catch(err => {
        console.error(err)  
          
        return this.fail(err.response?.data)
      })
  }
    
  async create(payload) {
    return axiosIns.post(this.baseUrl + '/create', payload)
      .then(res => { 
        return this.success(res.data)
      })
      .catch(err => {
        console.error(err)  
          
        return this.fail(err.response?.data)
      })
  }
    
  async update(id, payload) {
    return axiosIns.put(this.baseUrl + `/update/${id}`, payload)
      .then(res => {
        return this.success(res.data)
      })
      .catch(err => {
        console.error(err)  
          
        return this.fail(err.response?.data)
      })
  }

  async delete(id) {
    return axiosIns.delete(this.baseUrl + `/delete/${id}`)
      .then(res => {

        return this.success(res.data)
      })
      .catch(err => {
        console.error(err)  
          
        return this.fail(err.response?.data)
      })
  }

  success(data) {
    return new Result(ResultType.SUCCESS, data)
  }
    
  fail(data) {
    return new Result(ResultType.FAIL, data)
  }
}

export default GenericService

