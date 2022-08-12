import request from '@/utils/httpRequest'

export default class CompetitionNewsService {
  save (inputForm) {
    return request({
      url: '/competition/competitionNews/save',
      method: 'post',
      data: inputForm
    })
  }

  delete (ids) {
    return request({
      url: '/competition/competitionNews/delete',
      method: 'delete',
      params: {ids: ids}
    })
  }

  queryById (id) {
    return request({
      url: '/competition/competitionNews/queryById',
      method: 'get',
      params: {id: id}
    })
  }

  list (params) {
    return request({
      url: '/competition/competitionNews/list',
      method: 'get',
      params: params
    })
  }
}
