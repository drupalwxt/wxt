## PostgreSQL

To properly configure PostgreSQL with Drupal you should ensure the following configuration is used.

> Note: Some customizations might be necessary depending on your individual requirements.

```sh
postgresqlConfiguration:
  listenAddresses: "'*'"
  maxConnections: "200"
  sharedBuffers: 512MB
  workMem: 2048MB
  effectiveCacheSize: 512MB
  effectiveIoConcurrency: "100"
  maintenanceWorkMem: 32MB
  minWalSize: 512MB
  maxWalSize: 512MB
  walBuffers: 8048kB
  byteaOutput: "'escape'"
  hugePages: "off"
  walLevel: "replica"
  maxWalSenders: "0"
  synchronousCommit: "on"
  walKeepSegments: "130"
  checkpointTimeout: "'15 min'"
  checkpointCompletionTarget: "0.9"
  walCompression: "on"
  walWriterDelay: 200ms
  walWriterFlushAfter: 1MB
  bgwriterDelay: 200ms
  bgwriterLruMaxpages: "100"
  bgwriterLruMultiplier: "2.0"
  bgwriterFlushAfter: "0"
  maxWorkerProcesses: "8"
  maxParallelWorkersPerGather: "4"
  maxParallelWorkers: "4"
```

> Note: The above is written in yaml syntax which will work for both Docker Compose and Kubernetes helm charts.
> For the `postgresql.conf` file itself without using these tools simply find the `_` counterpart.

### Performance

#### Queries leveraging ILIKE

There is a known PostgreSQL performance issue that exists in Drupal and is related to leveraging queries with `ILIKE`.

This issue is particularly noticeable in relation to the path_alias table.

There are patches being worked on to handle this in Drupal core but a very quick fix can be implemented leveraging pg_trgm.

There is a great blog article listed below which goes over this issue in more detail.

* https://ferfebles.github.io/2018/04/16/Improving-large-Drupal-Postgres-performance-by-using-pg_trgm.html

The instructions are a bit outdated so the updated syntax to enter in psql is given below:

```sh
CREATE EXTENSION pg_trgm;
CREATE INDEX path_alias__alias_trgm_gist_idx ON path_alias USING gist (alias gist_trgm_ops);
CREATE INDEX path_alias__path_trgm_gist_idx ON path_alias USING gist (path gist_trgm_ops);
ANALYZE path_alias;
```
