import request from '@/utils/httpRequest'

export default class RefereeService {
  save (inputForm) {
    return request({
      url: '/referee/referee/save',
      method: 'post',
      data: inputForm
    })
  }

  delete (ids) {
    return request({
      url: '/referee/referee/delete',
      method: 'delete',
      params: {ids: ids}
    })
  }

  queryById (id) {
    return request({
      url: '/referee/referee/queryById',
      method: 'get',
      params: {id: id}
    })
  }

  list (params) {
    return request({
      url: '/referee/referee/list',
      method: 'get',
      params: params
    })
  }
}
