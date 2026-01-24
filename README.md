# Network Based Solutions

[networkbasedsolutions.com](https://networkbasedsolutions.com) / [nbsllc.tech](http://nbsllc.tech)

## Development

### Prerequisites

- [ASDF](https://asdf-vm.com)

### Build

```bash
> asdf install
```

### Run

```bash
> deno task dev
```

### Deploy

Ensure the following environment variables are set:

```env
SFTP_HOST
SFTP_USERNAME
SFTP_PASSWORD
SFTP_PATH
```

```bash
> deno task deploy
```
