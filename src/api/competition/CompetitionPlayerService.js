import request from '@/utils/httpRequest'

export default class CompetitionPlayerService {
  save (inputForm) {
    return request({
      url: '/competition/competitionPlayer/save',
      method: 'post',
      data: inputForm
    })
  }

  delete (ids) {
    return request({
      url: '/competition/competitionPlayer/delete',
      method: 'delete',
      params: {ids: ids}
    })
  }

  queryById (id) {
    return request({
      url: '/competition/competitionPlayer/queryById',
      method: 'get',
      params: {id: id}
    })
  }

  list (params) {
    return request({
      url: '/competition/competitionPlayer/list',
      method: 'get',
      params: params
    })
  }
}
