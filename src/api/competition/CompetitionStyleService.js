import request from '@/utils/httpRequest'

export default class CompetitionStyleService {
  save (inputForm) {
    return request({
      url: '/competition/competitionStyle/save',
      method: 'post',
      data: inputForm
    })
  }

  delete (ids) {
    return request({
      url: '/competition/competitionStyle/delete',
      method: 'delete',
      params: {ids: ids}
    })
  }

  queryById (id) {
    return request({
      url: '/competition/competitionStyle/queryById',
      method: 'get',
      params: {id: id}
    })
  }

  list (params) {
    return request({
      url: '/competition/competitionStyle/list',
      method: 'get',
      params: params
    })
  }
}
