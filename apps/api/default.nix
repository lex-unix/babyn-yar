{
  lib,
  buildGoModule,
}: let
  filterSrc = src: regexes:
    lib.cleanSourceWith {
      inherit src;
      filter = path: type: let
        srcPath = toString src;
        pathString = toString path;
        relPath = lib.removePrefix (srcPath + "/") pathString;
      in
        pathString == srcPath || lib.any (re: builtins.match re relPath != null) regexes;
    };
in
  buildGoModule {
    pname = "babyn-yar-api";
    version = "1.0.0";
    src = filterSrc ./. [
      "^go\\.mod$"
      "^go\\.sum$"
      "^cmd(/.*)?$"
      "^internal(/.*)?$"
    ];
    proxyVendor = true;
    vendorHash = "sha256-MZhHnSqRnRsdSLjJpefwPolFB16pj0FiwRuT2mbLMP8=";
    ldflags = ["-s" "-w"];
    env.CGO_ENABLED = 0;
    subPackages = ["cmd/api"];
  }
