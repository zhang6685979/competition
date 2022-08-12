import request from '@/utils/httpRequest'

export default class CompetitionLiveService {
  save (inputForm) {
    return request({
      url: '/competition/competitionLive/save',
      method: 'post',
      data: inputForm
    })
  }

  delete (ids) {
    return request({
      url: '/competition/competitionLive/delete',
      method: 'delete',
      params: {ids: ids}
    })
  }

  queryById (id) {
    return request({
      url: '/competition/competitionLive/queryById',
      method: 'get',
      params: {id: id}
    })
  }

  list (params) {
    return request({
      url: '/competition/competitionLive/list',
      method: 'get',
      params: params
    })
  }
}
