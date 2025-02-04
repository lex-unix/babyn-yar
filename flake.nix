{
  description = "A Nix-flake-based development environment";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/release-24.11";

  outputs =
    { self, nixpkgs }:
    let
      goVersion = 23;

      supportedSystems = [
        "x86_64-linux"
        "aarch64-linux"
        "x86_64-darwin"
        "aarch64-darwin"
      ];

      forEachSupportedSystem =
        f:
        nixpkgs.lib.genAttrs supportedSystems (
          system:
          f {
            pkgs = import nixpkgs {
              inherit system;
              overlays = [ self.overlays.default ];
            };
          }
        );
    in
    {
      overlays.default = final: prev: rec {
        go = final."go_1_${toString goVersion}";
        nodejs = prev.nodejs;
        yarn = (prev.yarn.override { inherit nodejs; });
      };

      devShells = forEachSupportedSystem (
        { pkgs }:
        {
          default = pkgs.mkShell {
            packages = with pkgs; [
              go
              nodejs
              yarn
              air
              go-migrate
              gnumake
            ];
          };
        }
      );
    };
}
