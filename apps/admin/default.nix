{
  lib,
  buildNpmPackage,
}: let
  filterSrc = src:
    lib.cleanSourceWith {
      inherit src;
      filter = path: _type: let
        srcPath = toString src;
        pathString = toString path;
        relPath = lib.removePrefix (srcPath + "/") pathString;
        excluded = [
          "^\\.git(/.*)?$"
          "^\\.jj(/.*)?$"
          "^\\.codex(/.*)?$"
          "^\\.direnv(/.*)?$"
          "^\\.env.*$"
          "(^|.*/)\\.DS_Store$"
          "(^|.*/)node_modules(/.*)?$"
          "(^|.*/)\\.turbo(/.*)?$"
          "(^|.*/)\\.astro(/.*)?$"
          "(^|.*/)\\.svelte-kit(/.*)?$"
          "(^|.*/)build(/.*)?$"
          "(^|.*/)dist(/.*)?$"
          "(^|.*/)bin(/.*)?$"
          ".*\\.mp4$"
          ".*\\.webm$"
          ".*\\.pdf$"
          "^packages/[^/]+/dist(/.*)?$"
        ];
      in
        pathString == srcPath || !lib.any (re: builtins.match re relPath != null) excluded;
    };
in
  buildNpmPackage {
    pname = "babyn-yar-admin";
    version = "1.0.0";

    src = filterSrc ../..;
    npmDepsHash = "sha256-SSMn4cLlt4gO4vADwY9f5Gu9FvEAGUL+y2EwgfjSDyU=";
    npmDepsFetcherVersion = 2;

    npmBuildScript = "build";
    npmBuildFlags = [
      "--"
      "--filter=admin..."
    ];

    installPhase = ''
      runHook preInstall

      mkdir -p $out
      cp -r apps/admin/build/. $out/

      runHook postInstall
    '';
  }
