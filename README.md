# babel-plugin-use-what-changed

This babel plugin us used with [@simbathesailor/use-what-changed](https://github.com/simbathesailor/babel-plugin-use-what-changed).

## Usage

The package can also be used with a babel plugin which make it more easy to debug.

1. Run

```

npm i @simbathesailor/use-what-changed --save-dev

```

2. Run

```

npm i @simbathesailor/babel-plugin-use-what-changed --save-dev

```

Add the plugin entry to your babel configurations

```js
{
  "plugins": [
    [
      "@simbathesailor/babel-plugin-use-what-changed",
      {
        "active": process.env.NODE_ENV === "development" // boolean
      }
    ]
  ]
}
```

Make sure the comments are enabled for your development build. As the plugin is solely dependent on the comments.

Now to debug a useEffect, useMemo or useCallback. You can do something like this:

```jsx
// uwc-debug
React.useEffect(() => {
  // console.log("some thing changed , need to figure out")
}, [a, b, c, d]);

// uwc-debug
const d = React.useCallback(() => {
  // console.log("some thing changed , need to figure out")
}, [a, b, d]);

// uwc-debug
const d = React.useMemo(() => {
  // console.log("some thing changed , need to figure out")
}, [a]);
```

### uwc-debug-below

Can use 'uwc-debug-below' comment to enable the debugging below the specific line.

```jsx
// uwc-debug-below
React.useEffect(() => {
  // console.log("some thing changed , need to figure out")
}, [a, b, c, d]);

const d = React.useCallback(() => {
  // console.log("some thing changed , need to figure out")
}, [a, b, d]);

const d = React.useMemo(() => {
  // console.log("some thing changed , need to figure out")
}, [a]);
```

All the react hooks below 'uwc-debug-below' will now be in debug mode.

**UPDATE**

Now, you can also see the file name with the hook name. E.g

> 2 useCallback::example/index.tsx 🧐👇

No need to add any import for use-what-changed, you just need to add a comment //uwc-debug' above your hooks and you should start seeing use-what-changed debug consoles.

<strong>Note: Frankly speaking the whole package was built, cause I was facing problems with hooks and debugging it was eating up a lot of my time. Definitely using this custom hook with babel plugin have saved me a lot of time and also understand unknown code using hooks</strong>
