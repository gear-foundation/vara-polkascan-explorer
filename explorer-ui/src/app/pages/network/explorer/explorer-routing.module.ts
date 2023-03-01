/*
 * Polkascan Explorer UI
 * Copyright (C) 2018-2022 Polkascan Foundation (NL)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExplorerComponent } from './explorer.component';

const routes: Routes = [
  {
    path: '',
    component: ExplorerComponent,
  },
  {
    path: 'block',
    loadChildren: () => import('./block/block.module').then(m => m.BlockModule)
  },
  {
    path: 'extrinsic',
    loadChildren: () => import('./extrinsic/extrinsic.module').then(m => m.ExtrinsicModule)
  },
  {
    path: 'transfer',
    loadChildren: () => import('./transfer/transfer.module').then(m => m.TransferModule)
  },
  {
    path: 'event',
    loadChildren: () => import('./event/event.module').then(m => m.EventModule)
  },
  {
    path: 'log',
    loadChildren: () => import('./log/log.module').then(m => m.LogModule)
  },
  {
    path: 'runtime',
    loadChildren: () => import('./runtime/runtime.module').then(m => m.RuntimePallet)
  },
  {
    path: 'account',
    loadChildren: () => import('./account/account.module').then(m => m.AccountModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExplorerRoutingModule {
}
