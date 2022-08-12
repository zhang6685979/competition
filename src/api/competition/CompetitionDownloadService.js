import request from '@/utils/httpRequest'

export default class CompetitionDownloadService {
  save (inputForm) {
    return request({
      url: '/competition/competitionDownload/save',
      method: 'post',
      data: inputForm
    })
  }

  delete (ids) {
    return request({
      url: '/competition/competitionDownload/delete',
      method: 'delete',
      params: {ids: ids}
    })
  }

  queryById (id) {
    return request({
      url: '/competition/competitionDownload/queryById',
      method: 'get',
      params: {id: id}
    })
  }

  list (params) {
    return request({
      url: '/competition/competitionDownload/list',
      method: 'get',
      params: params
    })
  }
}
