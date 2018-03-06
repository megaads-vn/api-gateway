module.exports = {
    port: 2307,
    debug: true,
    requestTimeout: -1,
    autoload: [
        "/controllers",
        "/entities",
        "/start",
        "/services",
    ],
    assetPath: "/assets",
    encryption: {
        'key': "d6F3Efeq",
        'cipher': "aes-256-ctr"
    },
    sslMode: {
        enable: false,
        port: 2308,
        options: {
            key: "/path/file.key",
            cert: "/path/file.crt"
        }
    },
    serviceToken: "xLhkjyKa",
    secret: "project-x",
    serviceUrl: "http://projectx-data-services.dev"
};
