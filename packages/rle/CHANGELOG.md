## [0.11.3] - 2025-04-21

### Changed

- Fixed the formatting of `!` in `stringifyRLE`.

## [0.11.2] - 2025-04-15

### Changed

- `stringifyRLE` outputs correct CXRLE comment.
- `stringifyRLE` does not output duplicated line ending.

## [0.11.1] - 2025-04-10

### Changed

- `parseRLE` ignores `#r` if rule is present
- `parseRLE` strict rle count
- `parseRLE` accept CR line ending
- `parseRLE` ignores leading whitespace

## [0.11.0] - 2025-04-06

### Changed

- `stringifyRLE` handles negative coordinates

## [0.10.0] - 2025-04-05

### Changed

- Add `readonly` to properties of `StringifyRLEOptions`
- Update dependencies.

## [0.9.0] - 2025-04-04

### Removed

- Removed `cellsToArray`. Use `CACellList.to2dArray` from `@ca-ts/pattern`
  package.
