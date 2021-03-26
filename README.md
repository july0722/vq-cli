# vq-cli 脚手架

## Project setup

```
yarn install
```

## 本地调试

```
npm link
```

## 根据 swagger 同步生成 api 文件

```
vq api
```

```js
// 对应的配置
  api: {
    prefixFilter: ['kaipuyun', 'fake-data'], // 过滤该前缀
    custom: {
      '/advance-notice-question/checkAdvanceNoticeWithdraw': { responseType: 'blob' }, // 对应的api可独立配置参数
      '/report/exportJsgcReport': { responseType: 'blob' },
    },
  },
```

## 运行

```
vq serve
```

## 构建

```
vq build
```
