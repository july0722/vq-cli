import Vue from 'vue'
;[require.context('../layouts', true, /\.vue$/), require.context('@/layouts', true, /\.vue$/)].forEach(ctx => {
  ctx
    .keys()
    .map(ctx)
    .forEach(item => {
      item.default.name && Vue.component(`layout-${item.default.name}`, item.default)
    })
})
