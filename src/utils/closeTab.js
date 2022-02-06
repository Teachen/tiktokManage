export function closeSelectedTag(view) {
  this.$store.dispatch('delVisitedViews', view).then((views) => {
    const latestView = views.slice(-1)[0]
    console.log(latestView, 'utils closeTab function by utills/closeTab')
    if (latestView) {
      this.$router.push(latestView.path)
    } else {
      this.$router.push('/')
    }
  })
}
