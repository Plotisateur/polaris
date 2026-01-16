# Typescript

Typescript is already installed and configured when generating a project.

## Installation and basic configuration

- Install typescript
  `yarn add --dev typescript`

- Install basic type definitions (pick what you need) which are not bundled with the dependencies on your project. All these types are referenced [here](https://github.com/DefinitelyTyped/DefinitelyTyped)

```js
yarn add --dev
    @types/cheerio
    @types/enzyme
    @types/history
    @types/jest
    @types/lodash
    @types/node
    @types/superagent
    @types/webpack-env
```

## Linter

- The project uses ESLINT to lint TypeScript code.

## Some conventions

- Otherwise the extension should be .ts
