import request from '@/utils/httpRequest'

export default class CompetitionEquipmentService {
  save (inputForm) {
    return request({
      url: '/competition/competitionEquipment/save',
      method: 'post',
      data: inputForm
    })
  }

  delete (ids) {
    return request({
      url: '/competition/competitionEquipment/delete',
      method: 'delete',
      params: {ids: ids}
    })
  }

  queryById (id) {
    return request({
      url: '/competition/competitionEquipment/queryById',
      method: 'get',
      params: {id: id}
    })
  }

  list (params) {
    return request({
      url: '/competition/competitionEquipment/list',
      method: 'get',
      params: params
    })
  }
}
