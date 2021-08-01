import { Route, Routes } from 'react-router'
import { ImpressSandboxRoute } from './impress'
import { PalimpsestSandboxRouter } from './palimpsest'
import { ParallaxSandboxRouter } from './parallax'
import { ReactElement } from 'react'
import { StageSandboxRouter } from './stage'
import { SwoopSandboxRouter } from './swoop'

export function SandboxRoute (): ReactElement {
  return (
    <Routes>
      <Route element={ <ImpressSandboxRoute /> } path='impress/*' />
      <Route element={ <ParallaxSandboxRouter /> } path='parallax/*' />
      <Route element={ <StageSandboxRouter /> } path='stage/*' />
      <Route element={ <PalimpsestSandboxRouter /> } path='palimpsest/*' />
      <Route element={ <SwoopSandboxRouter /> } path='swoop/*' />
    </Routes>
  )
}
