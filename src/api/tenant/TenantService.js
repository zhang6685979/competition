import request from '@/utils/httpRequest'

export default class TenantService {
  save (inputForm) {
    return request({
      url: '/tenant/tenant/save',
      method: 'post',
      data: inputForm
    })
  }

  delete (ids) {
    return request({
      url: '/tenant/tenant/delete',
      method: 'delete',
      params: {ids: ids}
    })
  }

  queryById (id) {
    return request({
      url: '/tenant/tenant/queryById',
      method: 'get',
      params: {id: id}
    })
  }

  list (params) {
    return request({
      url: '/tenant/tenant/list',
      method: 'get',
      params: params
    })
  }
}
