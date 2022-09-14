import request from '@/utils/httpRequest'

export default class VoteSubjectService {
  save (inputForm) {
    return request({
      url: '/vote/voteSubject/save',
      method: 'post',
      data: inputForm
    })
  }

  delete (ids) {
    return request({
      url: '/vote/voteSubject/delete',
      method: 'delete',
      params: {ids: ids}
    })
  }

  queryById (id) {
    return request({
      url: '/vote/voteSubject/queryById',
      method: 'get',
      params: {id: id}
    })
  }

  list (params) {
    return request({
      url: '/vote/voteSubject/list',
      method: 'get',
      params: params
    })
  }
}
