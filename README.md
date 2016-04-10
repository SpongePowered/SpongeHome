# SpongeHome
A brand new homepage for SpongePowered

Changes can be viewed live at:
https://rawgit.com/SpongePowered/SpongeHome/master/index.html

# Contributing & Building
If you would like to contribute then you will need to know how to work with what
we have so far. As our site is you will be able to run it as a completely standalone
website with out needing a local server. This may change in the future but for now
it's standalone.

## Building
Although the site is standalone we are using the Sass preprocessor for out sheet
styling. If you want to work with the site you will need to build the Sass file
for each new change you want to make to the css code. You can do this by downloading
Sass [Link for that is here](http://sass-lang.com/install).

When you want to build the file you will need to run
`sass spongehome.sass spongehome.min.sass --style compressed`

For long time work on the Sass files, I would suggest using either [Atom](https://atom.io/)
or [Sublime 3](https://www.sublimetext.com/3).
For Sublime you will need to get [Package control](https://packagecontrol.io/installation)
and then install [SassBuilder](https://packagecontrol.io/packages/SassBuilder).
For Atom go to the settings then install a new packages called Sass Autocomplie.

Both of these packages will compile our sass code into css. Please be sure to keep
the compliers Compressing the code and calling the compressed file spongehome.min.css
