# Benchmarking Edge vs Proxy

## Requirements
* docker
* docker compose

## Pre benchmarking setup
1. Start local unleash

```bash
docker compose up unleash
```
2. Load with data. If you're on linux, the `unleash-datagenerator` binary available can do the job for you. If on mac or windows, https://github.com/chriswk/unleash-datagenerator and build for your platform

```bash
./unleash-datagenerator -a "*:*.admintoken" -c <NUMBER_OF_FEATURES> -s <NUMBER_OF_STRATEGIES_PER_FEATURE> -u http://localhost:4342
```

3. Create a frontend token, username and password for logging in to http://localhost:4243 is `username: admin password: unleash4all`
  - https://docs.getunleash.io/reference/api-tokens-and-client-keys#front-end-tokens

4. Make sure ./k6data is writable by everyone
```bash
chmod a+w -R ./k6data
```

## Edge

Using a frontend token that Edge has never seen before with the short timeouts we have in k6 causes the first couple of thousand requests to fail with 511. Which is Edge's way of telling us that it hasn't been able to authenticate your frontend key yet. To avoid this.
1. Run `docker compose up unleash-edge`
2. Run one curl against unleash-edge `curl -H"Authorization: <token you created in step 3 in pre benchmarking>" http://localhost:3063/api/frontend`

## Benchmark scripts

Update line 21 in edgebenchmark.js with the frontend token you created

## Start benchmarking
```bash
docker compose up
```

## Notes

Both Edge and Proxy are limited to
1 CPU and 1 GB memory, in addition Edge is run with just 1 worker.

## Monitoring
* There's an extra compose file here called metrics-compose.yml. It fires up prometheus and grafana, as well as a docker-stats prometheus reporter, which will allow prometheus to poll it to record data from the `docker stats` command into prometheus. to start run `docker compose -f metrics-compose.yml up`

* Logging into grafana is done using admin as both the username and the password.
* There's a ready dashboard to graph the metrics from docker stats here: https://grafana.com/grafana/dashboards/13331-docker-stats/



## Improvements

Make more instances of edge running with 2, 4, 8 CPU / workers benchmarks as well.

## Results

You'll find two html files inside k6data once the benchmark is done, one with the `edge` prefix and one with the `proxy` prefix.
