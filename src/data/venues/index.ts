import type { Venue } from '../../types';
import { rvaVenues } from './rva';
import { nycVenues } from './nyc';
import { laVenues } from './la';
import { chiVenues } from './chi';
import { houVenues } from './hou';
import { phxVenues } from './phx';
import { phlVenues } from './phl';
import { satVenues } from './sat';
import { sdVenues } from './sd';
import { dalVenues } from './dal';
import { ausVenues } from './aus';

export const VENUES: Record<string, Venue[]> = {
  rva: rvaVenues,
  nyc: nycVenues,
  la: laVenues,
  chi: chiVenues,
  hou: houVenues,
  phx: phxVenues,
  phl: phlVenues,
  sat: satVenues,
  sd: sdVenues,
  dal: dalVenues,
  aus: ausVenues,
};
