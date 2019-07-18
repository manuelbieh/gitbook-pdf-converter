# gitbook-pdf-converter

## Setup

1. clone this repo
2. cd into the cloned repo
3. `yarn setup`

## Previewing the HTML

1. `yarn preview`

## Building the PDF

1. `yarn generate:pdf`

## Building the ePub

You need to have [pandoc](https://pandoc.org/) installed and in your $PATH

1. `yarn generate:epub`

## Updating the content

Whenever there was an update to the book, you need to update the files in `./content` first. You can use `yarn update` as shortcut if you're too lazy to cd into the folder and git pull it.
