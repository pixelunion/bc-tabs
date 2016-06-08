module.exports = {
  context: __dirname + "/src",
  entry: "./demo",
  devtool: 'source-map',
  output: {
    path: __dirname + "/demo",
    filename: "script.js"
  },
  externals: {
  },
  module: {
    loaders: [
      { 
        test: /\.js$/, 
        exclude: /node_modules/, 
        loader: "babel-loader" 
      },
      {
        test: /\.scss$/,
        loaders: ["style", "css", "sass"]
      }
    ]
  }
};
