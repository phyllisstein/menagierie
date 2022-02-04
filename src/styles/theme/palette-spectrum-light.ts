/* eslint-disable sort-keys, sort-keys-fix/sort-keys-fix */

import chroma from 'chroma-js'
import R from 'ramda'

export const js = {
  gray50: chroma('hsl(0, 0%, 100%)'),
  gray75: chroma('hsl(0, 0%, 98%)'),
  gray100: chroma('hsl(0, 0%, 96%)'),
  gray200: chroma('hsl(0, 0%, 92%)'),
  gray300: chroma('hsl(0, 0%, 88%)'),
  gray400: chroma('hsl(0, 0%, 79%)'),
  gray500: chroma('hsl(0, 0%, 70%)'),
  gray600: chroma('hsl(0, 0%, 56%)'),
  gray700: chroma('hsl(0, 0%, 43%)'),
  gray800: chroma('hsl(0, 0%, 29%)'),
  gray900: chroma('hsl(0, 0%, 17%)'),
  blue400: chroma('hsl(213, 83%, 54%)'),
  blue500: chroma('hsl(213, 84%, 49%)'),
  blue600: chroma('hsl(213, 88%, 43%)'),
  blue700: chroma('hsl(213, 91%, 38%)'),
  green400: chroma('hsl(160, 55%, 40%)'),
  green500: chroma('hsl(160, 58%, 35%)'),
  green600: chroma('hsl(160, 75%, 29%)'),
  green700: chroma('hsl(162, 75%, 25%)'),
  orange400: chroma('hsl(32, 80%, 50%)'),
  orange500: chroma('hsl(32, 86%, 46%)'),
  orange600: chroma('hsl(30, 85%, 43%)'),
  orange700: chroma('hsl(30, 87%, 40%)'),
  red400: chroma('hsl(357, 73%, 59%)'),
  red500: chroma('hsl(357, 67%, 53%)'),
  red600: chroma('hsl(357, 69%, 47%)'),
  red700: chroma('hsl(357, 82%, 40%)'),
  seafoam400: chroma('hsl(182, 70%, 35%)'),
  seafoam500: chroma('hsl(183, 73%, 32%)'),
  seafoam600: chroma('hsl(182, 79%, 27%)'),
  seafoam700: chroma('hsl(182, 85%, 24%)'),
  indigo400: chroma('hsl(240, 78%, 66%)'),
  indigo500: chroma('hsl(240, 68%, 62%)'),
  indigo600: chroma('hsl(240, 60%, 57%)'),
  indigo700: chroma('hsl(240, 53%, 53%)'),
  purple400: chroma('hsl(267, 63%, 59%)'),
  purple500: chroma('hsl(267, 56%, 55%)'),
  purple600: chroma('hsl(267, 49%, 50%)'),
  purple700: chroma('hsl(267, 52%, 46%)'),
  fuchsia400: chroma('hsl(295, 59%, 51%)'),
  fuchsia500: chroma('hsl(295, 59%, 46%)'),
  fuchsia600: chroma('hsl(295, 62%, 42%)'),
  fuchsia700: chroma('hsl(295, 65%, 37%)'),
  magenta400: chroma('hsl(327, 67%, 53%)'),
  magenta500: chroma('hsl(327, 68%, 48%)'),
  magenta600: chroma('hsl(327, 74%, 42%)'),
  magenta700: chroma('hsl(327, 85%, 37%)'),
  yellow400: chroma('hsl(51, 100%, 44%)'),
  yellow500: chroma('hsl(51, 100%, 41%)'),
  yellow600: chroma('hsl(51, 100%, 38%)'),
  yellow700: chroma('hsl(50, 100%, 36%)'),
  chartreuse400: chroma('hsl(92, 60%, 54%)'),
  chartreuse500: chroma('hsl(92, 52%, 51%)'),
  chartreuse600: chroma('hsl(92, 51%, 47%)'),
  chartreuse700: chroma('hsl(92, 53%, 43%)'),
  celery400: chroma('hsl(130, 45%, 49%)'),
  celery500: chroma('hsl(130, 46%, 45%)'),
  celery600: chroma('hsl(130, 47%, 41%)'),
  celery700: chroma('hsl(130, 48%, 37%)'),
}

export type JS = typeof js
export type CSS = { [k in keyof JS]: string }

export const css: CSS = R.map(R.invoker(0, 'css'), js)
