# voicod

Voice note editor

## Usage

- Open <https://voicod.pages.dev/>

:memo: Require [SpeechRecognition](https://developer.mozilla.org/docs/Web/API/SpeechRecognition/SpeechRecognition) API supported browser like Google Chrome

## Parameters

- `?noSave`: no use localStorage
  - Do not load previous text, and do not write current text to storage

## `x-callback` support

Voicod support `x-callback-url`.

- [1.0 DRAFT Spec | x-callback-url](http://x-callback-url.com/specifications/)

Parameters

- `x-success=<encoed url>`: open the url when click "OK" button
  - `{{reuslt}}` placeholder will be replaced the result text
- `x-cancel=<encoed url>`: open the url when click "Cancel" button
- `x-error=<encoed url>`: open the url when occur error
  - `{{errorMessage}}` placeholder will be replaced the error message
- `x-onetime`: when `x-onetime` is passed, open the `x-success`'s url automatically

Examples:

```
https://voicod.pages.dev/x-success=https%3A%2F%2Fgithub.com%2Fazu%2Fvoicod%2Fissues%2Fnew%3Ftitle%3D%7B%7Bresult%7D%7D
// → Open "https://github.com/azu/voicod/issues/new?title={{result}}" when click "OK" button
https://voicod.pages.dev/?x-onetime&x-success=https%3A%2F%2Fgithub.com%2Fazu%2Fvoicod%2Fissues%2Fnew%3Ftitle%3D%7B%7Bresult%7D%7D
// → Open "https://github.com/azu/voicod/issues/new?title={{result}}" after input your voice
```


## Changelog

See [Releases page](https://github.com/azu/voicod/releases).

## Running tests

Install devDependencies and Run `npm test`:

    npm test

## Contributing

Pull requests and stars are always welcome.

For bugs and feature requests, [please create an issue](https://github.com/azu/voicod/issues).

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Author

- [github/azu](https://github.com/azu)
- [twitter/azu_re](https://twitter.com/azu_re)

## License

MIT © azu
