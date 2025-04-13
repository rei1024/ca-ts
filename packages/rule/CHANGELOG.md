## Unreleased

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
