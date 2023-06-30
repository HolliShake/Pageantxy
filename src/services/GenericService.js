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
    this.baseUrl = `/api/${this.constructor.name.replace('Service', '')}`
  }
    
  async getAll() {
    return axiosIns.get(this.baseUrl + '/all')
      .then(res => this.success(res.data))
      .catch(err => {
        console.error(err.response.data)
          
        return this.fail(null)
      })
  }
    
  async get(id) {
    return axiosIns.get(this.baseUrl + `/${id}`)
      .then(res => this.success(res.data))
      .catch(err => {
        console.error(err.response.data)  
          
        return this.fail(null)
      })
  }
    
  async create(payload) {
    return axiosIns.get(this.baseUrl + '/create', payload)
      .then(res => this.success(res.data))
      .catch(err => {
        console.error(err.response.data)  
          
        return this.fail(null)
      })
  }
    
  async update(id, payload) {
    return axiosIns.get(this.baseUrl + `/update/${id}`, payload)
      .then(res => this.success(res.data))
      .catch(err => {
        console.error(err.response.data)  
          
        return this.fail(null)
      })
  }

  async delete(id) {
    return axiosIns.get(this.baseUrl + `/delete/${id}`)
      .then(res => this.success(res.data))
      .catch(err => {
        console.error(err.response.data)  
          
        return this.fail(null)
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

