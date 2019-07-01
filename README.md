SpongeHome
==========

The Sponge Project [website](https://www.spongepowered.org/), licensed
under the MIT license. See [LICENSE.md](LICENSE.md) for details.

## Running locally

### 1. Prerequisites

- [Golang](https://golang.org/doc/install)
- [node.js](https://nodejs.org/download/)

### 2. Cloning

To clone SpongeHome and get all of it's dependencies you can run:

```
go get github.com/SpongePowered/SpongeHome
```

### 3. Installing Gulp

To watch and compile the SASS files you will need Gulp installed.

```
npm install gulp --global
npm install
```

Now you are ready to use Gulp.

### 4. Using Gulp

For just building the sass files use `gulp build`.
For watching the sass files use `gulp watch` - This will keep building the sass
files as you edit them.

### 5. Running the application

To run SpongeHome, you can run `go run spongehome.go` in terminal, or the
command line. SpongeHome will now be running locally on port 4000.

**NOTE:** You will need to rerun this when you make a change to the Golang
source.

## Environment variables

**Optional**:
- `MACARON_ENV=production`: Set the application in production mode
- `PORT`: Modify the port of the HTTP server
- `FASTLY_CACHE=API_KEY/SERVICE_ID[;healthcheck]`: Purge Fastly cache after start and hide health checks from the log

## Build directories

- `public` contains the static assets that are served directly (e.g. images)
- `dist/dev` contains the static files to serve in the development environment
- `dist/prod` contains the static files to serve in the production environment
