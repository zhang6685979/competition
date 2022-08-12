import request from '@/utils/httpRequest'

export default class CarouselService {
  save (inputForm) {
    return request({
      url: '/carousel/carousel/save',
      method: 'post',
      data: inputForm
    })
  }

  delete (ids) {
    return request({
      url: '/carousel/carousel/delete',
      method: 'delete',
      params: {ids: ids}
    })
  }

  queryById (id) {
    return request({
      url: '/carousel/carousel/queryById',
      method: 'get',
      params: {id: id}
    })
  }

  list (params) {
    return request({
      url: '/carousel/carousel/list',
      method: 'get',
      params: params
    })
  }
}
