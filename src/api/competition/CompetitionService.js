import request from '@/utils/httpRequest'

export default class CompetitionService {
  save (inputForm) {
    return request({
      url: '/competition/competition/save',
      method: 'post',
      data: inputForm
    })
  }

  delete (ids) {
    return request({
      url: '/competition/competition/delete',
      method: 'delete',
      params: {ids: ids}
    })
  }

  queryById (id) {
    return request({
      url: '/competition/competition/queryById',
      method: 'get',
      params: {id: id}
    })
  }

  list (params) {
    return request({
      url: '/competition/competition/list',
      method: 'get',
      params: params
    })
  }
}
