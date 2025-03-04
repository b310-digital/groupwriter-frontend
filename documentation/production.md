# Setup for Production
## Docker Compose
Important: Currently, the backend is expected to run on the subdomain `write-backend` as it is configured within the frontend during build time.

```
services:
  editor:
    image: ghcr.io/b310-digital/groupwriter-frontend:latest
    ports:
      - "${APP_FRONTEND_PORT:-8080}:8080"
  backend:
    image: ghcr.io/b310-digital/groupwriter-backend:latest
    container_name: backend
    environment:
      DATABASE_URL: postgresql://groupwriter-user:groupwriter-password@postgres/groupwriter-backend-dev
      PORT: 3000
      OBJECT_STORAGE_BUCKET: groupwriter
      OBJECT_STORAGE_SCHEME: "http://"
      OBJECT_STORAGE_HOST: minio
      OBJECT_STORAGE_PORT: 9000
      OBJECT_STORAGE_REGION: local
      OBJECT_STORAGE_USER: ${DOCKER_COMPOSE_APP_OBJECT_STORAGE_USER}
      OBJECT_STORAGE_PASSWORD: ${DOCKER_COMPOSE_APP_OBJECT_STORAGE_PASSWORD}
      # needs to be exactly 32 chars
      VAULT_ENCRYPTION_KEY_BASE64: ${DOCKER_COMPOSE_APP_VAULT_ENCRYPTION_KEY_BASE64}
      # delete old documents
      FEATURE_REMOVE_DOCUMENTS_TOGGLE: ${DOCKER_COMPOSE_APP_FEATURE_REMOVE_DOCUMENTS_TOGGLE:-false}
      FEATURE_REMOVE_DOCUMENTS_MAX_AGE_IN_DAYS: ${DOCKER_COMPOSE_APP_FEATURE_REMOVE_DOCUMENTS_MAX_AGE_IN_DAYS:-730}
    ports:
      - "3000:3000"
    restart: always
  postgres:
    image: postgres:15-alpine
    environment:
      PGDATA: /var/lib/postgresql/data/pgdata
      POSTGRES_DB: ${POSTGRES_DB:-groupwriter-backend-dev}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-groupwriter-password}
      POSTGRES_USER: ${POSTGRES_USER:-groupwriter-user}

    # Exposing the port is not needed unless you want to access this database instance from the host.
    # Be careful when other postgres docker container are running on the same port
    ports:
      - "${POSTGRES_PORT:-5432}:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data/pgdata

  minio:
    image: minio/minio
    container_name: minio
    ports:
      - "9000:9000"
      - "9001:9001"
    environment:
      MINIO_ROOT_USER: ${DOCKER_COMPOSE_MINIO_USER:-ROOTNAME}
      MINIO_ROOT_PASSWORD: ${DOCKER_COMPOSE_MINIO_PASSWORD:-CHANGEME123}
    volumes:
      - ~/minio/data:/data
    command: server /data --console-address ":9001"

volumes:
  postgres_data:
```

Example for a `.env` file:

```
PORT=3000
DOCKER_COMPOSE_APP_OBJECT_STORAGE_USER=
DOCKER_COMPOSE_APP_OBJECT_STORAGE_PASSWORD=
# needs to be exactly 32 chars
DOCKER_COMPOSE_APP_VAULT_ENCRYPTION_KEY_BASE64=
DOCKER_COMPOSE_APP_FEATURE_REMOVE_DOCUMENTS_TOGGLE=false
DOCKER_COMPOSE_APP_FEATURE_REMOVE_DOCUMENTS_MAX_AGE_IN_DAYS=730

DOCKER_COMPOSE_MINIO_USER=minio
DOCKER_COMPOSE_MINIO_PASSWORD=
```

Then start it:

```
docker compose up -d
```

And visit the app at `localhost:8080`!

## Options and configurations

Please see the dedicated [backend](https://github.com/b310-digital/groupwriter-backend?tab=readme-ov-file#options--env-variables) repo for details on configuration options.