const getters = {
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  photo: state => state.user.photo,
  name: state => state.user.name,
  loginName: state => state.user.loginName,
  memberName: state => state.user.memberName,
}
export default getters
