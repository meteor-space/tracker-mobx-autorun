import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';
import observeCursor from './observe-cursor';
import autorun from './autorun';

checkNpmVersions({
  'mobx': '2.x'
}, 'space:tracker-mobx-autorun');

export default autorun;
export const observe = observeCursor;
