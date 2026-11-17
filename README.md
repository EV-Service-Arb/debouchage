# debouchage
![Lines Of Code](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/valeratrades/b48e6f02c61942200e7d1e3eeabf9bcb/raw/debouchage-loc.json)
<br>
[<img alt="ci errors" src="https://img.shields.io/github/actions/workflow/status/@@REPO_SLUG@@/errors.yml?branch=main&style=for-the-badge&style=flat-square&label=errors&labelColor=420d09" height="20">](https://github.com/@@REPO_SLUG@@/actions?query=branch%3Amain) <!--NB: Won't find it if repo is private-->
[<img alt="ci warnings" src="https://img.shields.io/github/actions/workflow/status/@@REPO_SLUG@@/warnings.yml?branch=main&style=for-the-badge&style=flat-square&label=warnings&labelColor=d16002" height="20">](https://github.com/@@REPO_SLUG@@/actions?query=branch%3Amain) <!--NB: Won't find it if repo is private-->

<!-- markdownlint-disable -->
<details>
<summary>
<h2>Installation</h2>
</summary>

The repo builds with Nix. Determinate Nix with `lazy-trees = true` is required.

```sh
nix develop
```

This gives you Node 22, Playwright with its pinned browsers and vips, and
writes the generated files — `.github/workflows/`, `.gitignore`,
`.treefmt.toml` and this README — from `flake.nix`. Edit the flake and
`docs/.readme_assets/`, not them.

Plain npm works for the app itself:

```sh
npm ci && npm run typecheck && npm run lint && npx vitest run && npm run build && npm run size && npm start
```


</details>
<!-- markdownlint-restore -->



<br>

<sup>Links for devs:</sup>
- <sup><a href="https://github.com/EV-Main/.github/blob/main/code/STYLE.md">style</a></sup>
- <sup><a href="https://github.com/EV-Main/.github/tree/main/code/conventions">conventions</a></sup>
- <sup><a href="https://github.com/EV-Main/.github/blob/main/code/conventions/git">contributing</a></sup>

#### License

<sup>
	Licensed under <a href="LICENSE">Blue Oak 1.0.0</a>
</sup>

<br>

<sub>
	Unless you explicitly state otherwise, any contribution intentionally submitted
for inclusion in this crate by you, as defined in the Apache-2.0 license, shall
be licensed as above, without any additional terms or conditions.
</sub>

