{
  dockerTools,
  cacert,
  api,
}:
dockerTools.buildLayeredImage {
  name = "babyn-yar-api";
  tag = "latest";

  extraCommands = ''
    mkdir -m 1777 tmp
  '';

  contents = [
    cacert
  ];

  config = {
    Cmd = [ "${api}/bin/api" ];
    Env = [
      "API_PORT=8000"
      "SSL_CERT_FILE=${cacert}/etc/ssl/certs/ca-bundle.crt"
      "TMPDIR=/tmp"
      "PATH=/bin"
    ];
    ExposedPorts = {
      "8000/tcp" = { };
    };
  };
}
