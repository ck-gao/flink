/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { JobManagerLogItemInterface } from 'interfaces';
import { JobManagerService } from 'services';

import { typeDefinition } from '../../../utils/strong-type';

@Component({
  selector: 'flink-job-manager-log-list',
  templateUrl: './job-manager-log-list.component.html',
  styleUrls: ['./job-manager-log-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JobManagerLogListComponent implements OnInit {
  listOfLog: JobManagerLogItemInterface[] = [];
  isLoading = true;

  trackByName = (_: number, log: JobManagerLogItemInterface): string => log.name;
  readonly narrowLogData = typeDefinition<JobManagerLogItemInterface>();

  sortLastModifiedTimeFn = (pre: JobManagerLogItemInterface, next: JobManagerLogItemInterface): number =>
    pre.mtime - next.mtime;
  sortSizeFn = (pre: JobManagerLogItemInterface, next: JobManagerLogItemInterface): number => pre.size - next.size;

  constructor(private jobManagerService: JobManagerService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.jobManagerService
      .loadLogList()
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe(data => {
        this.listOfLog = data;
      });
  }
}
