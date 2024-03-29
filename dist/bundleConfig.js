import resolve from 'rollup-plugin-node-resolve';

export default [
  {
    input: '..\\container.js',
    output: {
      file: 'ex-element.js',
      format: 'es'
    },
    plugins: [
      resolve({})
    ]
  }, {
    input: '..\\container.js',
    output: {
      file: '..\\testServer\\ex-element.js',
      format: 'es'
    },
    plugins: [
      resolve()
    ]
  }];

  //run rollup --config bundleConfig.js