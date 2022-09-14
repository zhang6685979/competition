import request from '@/utils/httpRequest'

export default class VoteCategoryService {
  save (inputForm) {
    return request({
      url: '/vote/voteCategory/save',
      method: 'post',
      data: inputForm
    })
  }

  delete (ids) {
    return request({
      url: '/vote/voteCategory/delete',
      method: 'delete',
      params: {ids: ids}
    })
  }

  queryById (id) {
    return request({
      url: '/vote/voteCategory/queryById',
      method: 'get',
      params: {id: id}
    })
  }

  treeData () {
    return request({
      url: '/vote/voteCategory/treeData',
      method: 'get'
    })
  }
}
