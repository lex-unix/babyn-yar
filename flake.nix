{
  description = "A Nix-flake-based development environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    go-overlay.url = "github:purpleclay/go-overlay";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
      go-overlay,
    }:
    {
      overlays.default = final: prev: {
        go = final.go-bin.versions."1.26.4";
        nodejs = final.nodejs_22;
      };
    }
    // (flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs {
          inherit system;
          overlays = [
            go-overlay.overlays.default
            self.overlays.default
          ];
        };
      in
      {
        devShells.default = pkgs.mkShell {
          packages = [
            pkgs.go
            pkgs.nodejs
            pkgs.air
            pkgs.go-migrate
            pkgs.go-tools
            pkgs.govulncheck
            pkgs.just
          ];
        };
      }
    ));
}
