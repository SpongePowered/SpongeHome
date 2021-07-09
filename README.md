SpongeHome
==========

The Sponge Project [website](https://www.spongepowered.org/), licensed
under the MIT license. See [LICENSE.md](LICENSE.md) for details.

## Prerequisites

- [Node.js](https://nodejs.org/download/)

## Clone
The following steps will ensure your project is cloned properly.
1. `git clone https://github.com/SpongePowered/SpongeHome.git`
2. `cd SpongeHome`

## Install dependencies

To install all required dependencies run `npm i`.

## Running in development mode

To run SpongeHome for development execute `npm run dev`.
SpongeHome will now be running locally on port 3000 and serving the directory 
at `dist/dev` which has been automatically created. The webserver watches all important files and
live-reloads changes made.

## Running in production mode

To build the project for production run `npm run build` and serve 
the directory at `dist/prod` using a production-ready webserver.
