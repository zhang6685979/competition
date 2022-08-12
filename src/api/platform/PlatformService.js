import request from '@/utils/httpRequest'

export default class PlatformService {
  save (inputForm) {
    return request({
      url: '/platform/platform/save',
      method: 'post',
      data: inputForm
    })
  }

  delete (ids) {
    return request({
      url: '/platform/platform/delete',
      method: 'delete',
      params: {ids: ids}
    })
  }

  queryById (id) {
    return request({
      url: '/platform/platform/queryById',
      method: 'get',
      params: {id: id}
    })
  }

  list (params) {
    return request({
      url: '/platform/platform/list',
      method: 'get',
      params: params
    })
  }
}
