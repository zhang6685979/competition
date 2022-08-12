import request from '@/utils/httpRequest'

export default class CompetitionRoundsService {
  save (inputForm) {
    return request({
      url: '/competition/competitionRounds/save',
      method: 'post',
      data: inputForm
    })
  }

  delete (ids) {
    return request({
      url: '/competition/competitionRounds/delete',
      method: 'delete',
      params: {ids: ids}
    })
  }

  queryById (id) {
    return request({
      url: '/competition/competitionRounds/queryById',
      method: 'get',
      params: {id: id}
    })
  }

  list (params) {
    return request({
      url: '/competition/competitionRounds/list',
      method: 'get',
      params: params
    })
  }
}
