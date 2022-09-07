import request from '@/utils/httpRequest'

export default class PlayerService {
  save (inputForm) {
    return request({
      url: '/player/player/save',
      method: 'post',
      data: inputForm
    })
  }

  delete (ids) {
    return request({
      url: '/player/player/delete',
      method: 'delete',
      params: {ids: ids}
    })
  }

  queryById (id) {
    return request({
      url: '/player/player/queryById',
      method: 'get',
      params: {id: id}
    })
  }

  list (params) {
    return request({
      url: '/player/player/list',
      method: 'get',
      params: params
    })
  }
}
