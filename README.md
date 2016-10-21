SpongeHome
==========

The Sponge Project [website](https://www-staging.spongepowered.org/), licensed
under the MIT license. See [LICENSE.md](LICENSE.md) for details.

### Branches

- `master` is hooked up to [www staging](https://www-staging.spongepowered.org/)
- `production` is hooked up to [www prod](https://www.spongepowered.org/)

## Running locally

### 1. Prerequisites

- [Golang](http://golang.org/doc/install)
- [node.js](http://nodejs.org/download/)

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
