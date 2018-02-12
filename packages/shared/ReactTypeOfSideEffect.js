/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

export type TypeOfSideEffect = number;

// Don't change these two values. They're used by React Dev Tools.
export const NoEffect = /*              */ 0b000000000000000;
export const PerformedWork = /*         */ 0b000000000000001;

// You can change the rest (and add more).
export const Placement = /*             */ 0b000000000000010;
export const Update = /*                */ 0b000000000000100;
export const PlacementAndUpdate = /*    */ 0b000000000000110;
export const Deletion = /*              */ 0b000000000001000;
export const ContentReset = /*          */ 0b000000000010000;
export const Callback = /*              */ 0b000000000100000;
export const DidCapture = /*            */ 0b000000001000000;
export const Ref = /*                   */ 0b000000010000000;
export const ErrLog = /*                */ 0b000000100000000;

// Union of all host effects
export const HostEffectMask = /*        */ 0b000000111111111;

// This indicates we exited the fiber without completing it.
export const Incomplete = /*            */ 0b000001000000000;

// Bits greater than Incomplete are used to identify fibers that threw. These
// are like algebraic effects. These bits are mutually exclusive.
export const Combined = /*              */ 0b000010000000000;
export const Err = /*                   */ 0b000100000000000;
export const Suspend = /*               */ 0b001000000000000;
export const Loading = /*               */ 0b010000000000000;
export const Timeout = /*               */ 0b100000000000000;

// Union of all algebraic effects
export const AlgebraicEffectMask = /*   */ 0b111110000000000;
