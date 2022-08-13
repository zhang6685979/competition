import request from '@/utils/httpRequest'

export default class CompetitionSignupService {
  save (inputForm) {
    return request({
      url: '/competition/competitionSignup/save',
      method: 'post',
      data: inputForm
    })
  }

  delete (ids) {
    return request({
      url: '/competition/competitionSignup/delete',
      method: 'delete',
      params: {ids: ids}
    })
  }

  queryById (id) {
    return request({
      url: '/competition/competitionSignup/queryById',
      method: 'get',
      params: {id: id}
    })
  }

  list (params) {
    return request({
      url: '/competition/competitionSignup/list',
      method: 'get',
      params: params
    })
  }
}
