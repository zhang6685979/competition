import request from '@/utils/httpRequest'

export default class CompetitionExamService {
  save (inputForm) {
    return request({
      url: '/exam/competitionExam/save',
      method: 'post',
      data: inputForm
    })
  }

  delete (ids) {
    return request({
      url: '/exam/competitionExam/delete',
      method: 'delete',
      params: {ids: ids}
    })
  }

  queryById (id) {
    return request({
      url: '/exam/competitionExam/queryById',
      method: 'get',
      params: {id: id}
    })
  }

  list (params) {
    return request({
      url: '/exam/competitionExam/list',
      method: 'get',
      params: params
    })
  }

  getRefereesByCid(params){
    return request({
      url: '/exam/competitionExam/referees',
      method: 'get',
      params: params
    })
  }

  getTeamsByCid(params){
    return request({
      url: '/exam/competitionExam/tree/teams',
      method: 'get',
      params: params
    })
  }
  getTeamById(id){
    return request({
      url: '/team/team/queryById',
      method: 'get',
      params: {id: id}
    })
  }
}
