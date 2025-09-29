## [0.15.0] - 2025-09-29

### Changed

- **BREAKING** Add hexagonal neighborhood isotropic non-totalistic rule.
  - Add `HexagonalINTRule` and `HexagonalINTCondition`

## [0.14.0] - 2025-09-27

### Changed

- **BREAKING** Supported other connecting directions in sphere grid.
- Exported `GridParameter`.

## [0.13.0] - 2025-09-27

### Changed

- **BREAKING** Support for hexagonal tripod neighborhood
  - `OuterTotalisticRule.hexagonalType` is added.
- Fix parsing for triangular vertices.

## [0.12.0] - 2025-09-26

### Changed

- **BREAKING** Support for triangular neighborhood
  - Add `"triangular"` to `OuterTotalisticRule.neighborhood`
  - `OuterTotalisticRule.triangularType` is added.

## [0.11.0] - 2025-04-16

### Changed

- **BREAKING** `OuterTotalisticRule.neighborhood` is added.
- **BREAKING** `stringifyRule` for MAP rules does not add padding.

## [0.10.0] - 2025-04-14

### Changed

- **BREAKING** Removed `/int` module.
- **BREAKING** `parseRule` Do not parse empty string as "B3/S23".
- Fix `stringifyRule` for 0 shift.
- `INTRule.transitions` order of conditions are canonicalized.
- Fix: Export `MAPRule`

## [0.9.0] - 2025-04-14

### Changed

- Add MAP strings support.
- `parseRule` and `stringifyRule` handles grid parameter.
  - Example: `B3/S23:T20,30`

## [0.8.0] - 2025-04-12

### Changed

- `parseRule` accept S/B notation for INT rule.
- `stringifyRule` accept `INTRule`.

## [0.7.0] - 2025-04-07

### Changed

- Fixed `parseRule`: Generations should be greater than or equal to 2.
- Add `stringifyRule`.

## [0.6.0] - 2025-02-08

### Changed

- Add support for generations prefix/postfix.
  - Example: `B3/S23/G8`, `G8/B3/S23`, `B3/S23/C8`, `C8/B3/S23`,

## [0.5.0] - 2025-01-16

### Changed

- Add Generations to outer-totalistic and INT.

## [0.4.0] - 2024-10-17

### Changed

- Accept lower case B/S.

## [0.3.0] - 2024-10-15

### Added

- Add INT (isotropic non-totalistic) rule. (#22)

## [0.2.0] 2024-10-14

### Added

- Add alias for life. (#20)

## [0.1.0] - 2024-10-14

### Added

- Add rulestring parser.
