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

import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { RuntimeService } from '../../../../../services/runtime/runtime.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { types as pst } from '@polkadapt/polkascan-explorer';
import { NetworkService } from '../../../../../services/network.service';
import {filter, first, map, switchMap, takeUntil, tap} from 'rxjs/operators';


@Component({
  selector: 'app-runtime-list',
  templateUrl: './runtime-list.component.html',
  styleUrls: ['./runtime-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RuntimeListComponent implements OnInit, OnDestroy {
  private destroyer: Subject<undefined> = new Subject();
  runtimes = new BehaviorSubject<pst.Runtime[]>([]);
  blockDates: {[blockNumber: string]: BehaviorSubject<Date | null>} = {};

  visibleColumns = ['icon', 'name', 'version', 'blockNumber', 'date', 'pallets', 'events', 'calls', 'storage', 'constants', 'details'];

  constructor(private ns: NetworkService,
              private rs: RuntimeService) {
  }

  ngOnInit(): void {
    this.ns.currentNetwork.pipe(
      takeUntil(this.destroyer),
      filter(network => !!network),
      first(),
      switchMap(network => this.rs.getRuntimes(network).pipe(
        takeUntil(this.destroyer)
      ))
    ).subscribe(runtimes => {
      for (let runtime of runtimes) {
        const datetimeBlockNumber: number = Math.max(1, runtime.blockNumber);
        if (!this.blockDates[runtime.blockNumber]) {
          this.blockDates[runtime.blockNumber] = new BehaviorSubject<Date | null>(null)
        }
        this.ns.blockHarvester.blocks[datetimeBlockNumber].pipe(
          takeUntil(this.destroyer),
          filter(block => Boolean(block.datetime)),
          map(block => block.datetime),
          first()
        ).subscribe(datetime => {
          if (datetime) {
            this.blockDates[runtime.blockNumber].next(new Date(datetime));
          }
        });
      }
      this.runtimes.next(runtimes);
    });
  }

  ngOnDestroy(): void {
    this.destroyer.next(undefined);
    this.destroyer.complete();
  }

  track(index: number, item: pst.Runtime): string {
    return `${item.specName}-${item.specVersion}`;
  }
}
