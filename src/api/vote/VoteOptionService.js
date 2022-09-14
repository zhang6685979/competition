import request from '@/utils/httpRequest'

export default class VoteOptionService {
  save (inputForm) {
    return request({
      url: '/vote/voteOption/save',
      method: 'post',
      data: inputForm
    })
  }

  delete (ids) {
    return request({
      url: '/vote/voteOption/delete',
      method: 'delete',
      params: {ids: ids}
    })
  }

  queryById (id) {
    return request({
      url: '/vote/voteOption/queryById',
      method: 'get',
      params: {id: id}
    })
  }

  list (params) {
    return request({
      url: '/vote/voteOption/list',
      method: 'get',
      params: params
    })
  }
}
