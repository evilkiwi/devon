import { promisify } from 'util';
import g from 'glob';

export const glob = promisify(g);
