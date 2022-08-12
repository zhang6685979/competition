import request from '@/utils/httpRequest'

export default class CompetitionAnnouncementService {
  save (inputForm) {
    return request({
      url: '/competition/competitionAnnouncement/save',
      method: 'post',
      data: inputForm
    })
  }

  delete (ids) {
    return request({
      url: '/competition/competitionAnnouncement/delete',
      method: 'delete',
      params: {ids: ids}
    })
  }

  queryById (id) {
    return request({
      url: '/competition/competitionAnnouncement/queryById',
      method: 'get',
      params: {id: id}
    })
  }

  list (params) {
    return request({
      url: '/competition/competitionAnnouncement/list',
      method: 'get',
      params: params
    })
  }
}
