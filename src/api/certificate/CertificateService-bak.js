import request from '@/utils/httpRequest'

export default class CertificateService {
  save (inputForm) {
    return request({
      url: '/certificate/certificate/save',
      method: 'post',
      data: inputForm
    })
  }

  delete (ids) {
    return request({
      url: '/certificate/certificate/delete',
      method: 'delete',
      params: {ids: ids}
    })
  }

  queryById (id) {
    return request({
      url: '/certificate/certificate/queryById',
      method: 'get',
      params: {id: id}
    })
  }

  list (params) {
    return request({
      url: '/certificate/certificate/list',
      method: 'get',
      params: params
    })
  }
}
