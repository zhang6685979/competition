import request from '@/utils/httpRequest'

export default class CompetitionNewsService {
  save (inputForm) {
    return request({
      url: '/news/news/save',
      method: 'post',
      data: inputForm
    })
  }

  delete (ids) {
    return request({
      url: '/news/news/delete',
      method: 'delete',
      params: {ids: ids}
    })
  }

  queryById (id) {
    return request({
      url: '/news/news/queryById',
      method: 'get',
      params: {id: id}
    })
  }

  list (params) {
    return request({
      url: '/news/news/list',
      method: 'get',
      params: params
    })
  }
}
