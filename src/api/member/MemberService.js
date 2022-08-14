import request from '@/utils/httpRequest'

export default class MemberService {
  save (inputForm) {
    return request({
      url: '/member/member/save',
      method: 'post',
      data: inputForm
    })
  }

  delete (ids) {
    return request({
      url: '/member/member/delete',
      method: 'delete',
      params: {ids: ids}
    })
  }

  queryById (id) {
    return request({
      url: '/member/member/queryById',
      method: 'get',
      params: {id: id}
    })
  }

  list (params) {
    return request({
      url: '/member/member/list',
      method: 'get',
      params: params
    })
  }
}
