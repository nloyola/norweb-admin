import { ConcurrencySafeEntity } from '../ConcurrencySafeEntity';
import { Status } from '../Status';
import { FunderTypes } from './FunderTypes';

export interface Funder extends ConcurrencySafeEntity {
  readonly name: string;
  readonly acronym: string;
  readonly countryCode: string;
  readonly web: string;
  readonly type: FunderTypes;
  readonly status: Status;
}

export type FunderAdd = Pick<Funder, 'name' | 'acronym' | 'countryCode' | 'web' | 'type'>;

export type FunderUpdate = FunderAdd & Pick<Funder, 'id' | 'version' | 'status'>;
