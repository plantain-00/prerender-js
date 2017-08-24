const childProcess = require('child_process')

module.exports = {
  build: [
    'rimraf dist/',
    'tsc -p src/'
  ],
  lint: {
    ts: `tslint "src/**/*.ts"`,
    js: `standard "**/*.config.js"`,
    export: `no-unused-export "src/**/*.ts" "spec/*.ts"`
  },
  test: [
    'tsc -p spec',
    'jasmine',
    () => new Promise((resolve, reject) => {
      const { createServer } = require('http-server')
      const server = createServer()
      server.listen(8000)
      childProcess.exec('node dist/index.js "http://localhost:8000/demo" --selector "#test" -o demo/test.html', (error, stdout, stderr) => {
        server.close()
        if (error) {
          reject(error)
        } else {
          resolve()
        }
      }).stdout.pipe(process.stdout)
    }),
    () => new Promise((resolve, reject) => {
      childProcess.exec('git status -s', (error, stdout, stderr) => {
        if (error) {
          reject(error)
        } else {
          if (stdout) {
            reject(new Error('generated files does not match.'))
          } else {
            resolve()
          }
        }
      }).stdout.pipe(process.stdout)
    })
  ],
  fix: {
    ts: `tslint --fix "src/**/*.ts"`,
    js: `standard --fix "**/*.config.js"`
  },
  release: `clean-release`
}
