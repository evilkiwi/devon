# 1.0.6 (2021-08-05)

- Allow overriding of `docker-compose` format version

# 1.0.5 (2021-08-04)

- Allow `mkcert` automation

# 1.0.4 (2021-08-04)

- Install `@casthub/devon` as a local dev dependency if supported (For type support)
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
