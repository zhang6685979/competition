import request from '@/utils/httpRequest'

export default class AnnouncementService {
  save (inputForm) {
    return request({
      url: '/announcement/announcement/save',
      method: 'post',
      data: inputForm
    })
  }

  delete (ids) {
    return request({
      url: '/announcement/announcement/delete',
      method: 'delete',
      params: {ids: ids}
    })
  }

  queryById (id) {
    return request({
      url: '/announcement/announcement/queryById',
      method: 'get',
      params: {id: id}
    })
  }

  list (params) {
    return request({
      url: '/announcement/announcement/list',
      method: 'get',
      params: params
    })
  }
}
