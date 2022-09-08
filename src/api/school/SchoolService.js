import request from '@/utils/httpRequest'

export default class SchoolService {
  save (inputForm) {
    return request({
      url: '/school/school/save',
      method: 'post',
      data: inputForm
    })
  }

  delete (ids) {
    return request({
      url: '/school/school/delete',
      method: 'delete',
      params: {ids: ids}
    })
  }

  queryById (id) {
    return request({
      url: '/school/school/queryById',
      method: 'get',
      params: {id: id}
    })
  }

  page (params) {
    return request({
      url: '/school/school/page',
      method: 'get',
      params: params
    })
  }

  list (params) {
    return request({
      url: '/school/school/list',
      method: 'get',
      params: params
    })
  }
  cities (params) {
    return request({
      url: '/school/school/cities',
      method: 'get',
      params: params
    })
  }
}
