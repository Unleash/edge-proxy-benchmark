# Benchmarking Edge vs Proxy

This uses Unleash's demo installation for both proxy and edge.

## Edge

Using a frontend token that Edge has never seen before with the short timeouts we have in k6 causes the first couple of thousand requests to fail with 511. Which is Edge's way of telling us that it hasn't been able to authenticate your frontend key yet. To avoid this.
1. Run `docker compose up unleash-edge`
2. Run one curl against unleash-edge `curl -H"Authorization: *:development.531d0f514a4c480d6508512c2bc69ce8b595e1cf3a00d18978edac6a" http://localhost:3063/api/frontend`
3. Run `docker compose up` to start benchmarking.


## Notes

Both Edge and Proxy are limited to
1 CPU and 1 GB memory, in addition Edge is run with just 1 worker.

## Improvements

Make more instances of edge running with 2, 4, 8 CPU / workers benchmarks as well.

## Results

It writes edge_results and proxy_results to ./k6data which can be viewed using any web browser
