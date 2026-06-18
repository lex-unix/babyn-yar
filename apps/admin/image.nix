{
  dockerTools,
  nginx,
  admin,
}: let
  nginxConf = builtins.toFile "nginx.conf" ''
    pid /tmp/nginx.pid;
    error_log /dev/stderr;

    events {}

    http {
      access_log /dev/stdout;
      client_body_temp_path /tmp/nginx_client_body;
      proxy_temp_path /tmp/nginx_proxy;
      fastcgi_temp_path /tmp/nginx_fastcgi;
      uwsgi_temp_path /tmp/nginx_uwsgi;
      scgi_temp_path /tmp/nginx_scgi;

      types {
        text/html html htm;
        text/css css;
        application/javascript js mjs;
        application/json json map;
        image/png png;
        image/svg+xml svg;
        image/x-icon ico;
        font/woff woff;
        font/woff2 woff2;
      }

      server {
        listen 80;

        location / {
          root ${admin};
          index index.html index.htm;
          try_files $uri /index.html =404;
        }

        error_page 500 502 503 504 /50x.html;

        location = /50x.html {
          root ${admin};
        }
      }
    }
  '';
in
  dockerTools.buildLayeredImage {
    name = "babyn-yar-admin";
    tag = "latest";

    extraCommands = ''
      mkdir -m 1777 tmp
    '';

    contents = [
      nginx
    ];

    config = {
      Cmd = [
        "${nginx}/bin/nginx"
        "-c"
        nginxConf
        "-g"
        "daemon off;"
      ];
      ExposedPorts = {
        "80/tcp" = {};
      };
    };
  }
