const path = require('path')


module.exports = {
  reactStrictMode: true,
  apiBaseUrl: "http://localhost:4000/api/",
  sassOptions: {
    includePaths: [ 
      path.join(__dirname, 'styles'),
      path.join(__dirname, 'components'),
      path.join(__dirname, 'pages')],
  },
}
