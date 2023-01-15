module.exports={
    presets: [
        ["@babel/preset-react", {"runtime": "automatic"}],
        "@babel/preset-env"
    ],
    plugins: [
        "babel-plugin-typescript-to-proptypes",
        "@babel/plugin-proposal-class-properties",
        "@babel/plugin-transform-react-jsx",
        "@babel/plugin-transform-typescript"
    ]
}