import request from '@/utils/httpRequest'

export default class MessageBoardService {
  save (inputForm) {
    return request({
      url: '/message/messageBoard/save',
      method: 'post',
      data: inputForm
    })
  }

  delete (ids) {
    return request({
      url: '/message/messageBoard/delete',
      method: 'delete',
      params: {ids: ids}
    })
  }

  queryById (id) {
    return request({
      url: '/message/messageBoard/queryById',
      method: 'get',
      params: {id: id}
    })
  }

  list (params) {
    return request({
      url: '/message/messageBoard/list',
      method: 'get',
      params: params
    })
  }
}
