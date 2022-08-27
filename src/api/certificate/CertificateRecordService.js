import request from '@/utils/httpRequest'

export default class CertificateRecordService {
  importFile (inputForm) {
    return request({
      url: '/certificate/certificate/record/import',
      method: 'post',
      data: inputForm
    })
  }
  save (inputForm) {
    return request({
      url: '/certificate/certificate/record/save',
      method: 'post',
      data: inputForm
    })
  }

  delete (ids) {
    return request({
      url: '/certificate/certificate/record/delete',
      method: 'delete',
      params: {ids: ids}
    })
  }

  queryById (id) {
    return request({
      url: '/certificate/certificate/record/queryById',
      method: 'get',
      params: {id: id}
    })
  }

  list (params) {
    return request({
      url: '/certificate/certificate/record/list',
      method: 'get',
      params: params
    })
  }
}
