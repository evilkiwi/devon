# 2.0.0 (2022-03-11)

- Moved bundler to `unbuild`
- Use NodeJS ESM as a default export
- Renamed company to Evil Kiwi Limited
- Enforce NodeJS version support via `package.json` `engines`
- Added a new `interact` command for starting a shell inside a container
- Updated dependencies

# 1.3.0 (2022-03-03)

- Added support for defining custom Networks

# 1.2.2 (2022-01-25)

- Fixed `proxy` template conf file host
- Improved feedback of the `install` command
- Added manual instructions for macOS 11+ users
- Updated dependencies

# 1.1.0 (2021-11-16)

- Store current services by Project name for better `switch` UX
- Fix issue when switching between different monorepos (Different folders = different project names)
- Improve devon repo (made it a monorepo)
- Various maintenance and library updates

# 1.0.8 (2021-08-05)

- Fix script output not using ASCII

# 1.0.7 (2021-08-05)

- Export command logic for programmatic use
- Added `down` command

# 1.0.6 (2021-08-05)

- Allow overriding of `docker-compose` format version

# 1.0.5 (2021-08-04)

- Allow `mkcert` automation

# 1.0.4 (2021-08-04)

- Install `@tnotifier/devon` as a local dev dependency if supported (For type support)
- Don't emit a `.env` file if service doesn't specify any env vars
- Don't override service-level configs if re-running `init`
- Update example to show full proxy configs
- Emit an example proxy config file for NGINX

# 1.0.3 (2021-08-04)

- Fix `.devon.ts` template adding unselected services on `init`

# 1.0.2 (2021-08-04)

- Fix `.devon.ts` template not adding correct service name

# 1.0.1 (2021-08-04)

- Fix duplicate services in `devon init` if they match multiple criteria

# 1.0.0 (2021-08-04)

- Initial release
