import { Tracker } from 'meteor/tracker';
import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';

checkNpmVersions({
  'mobx': '2.3.x'
}, 'space:reaction');

const { autorun } = require('mobx');

export default (reaction) => {
  let mobxDisposer = null;
  let computation = null;
  let hasBeenStarted;
  return {
    start() {
      let isFirstRun = true;
      computation = Tracker.autorun(() => {
        if (mobxDisposer) {
          mobxDisposer();
          isFirstRun = true;
        }
        mobxDisposer = autorun(() => {
          if (isFirstRun) {
            reaction();
          } else {
            computation.invalidate();
          }
          isFirstRun = false;
        });
      });
      hasBeenStarted = true;
    },
    stop() {
      if (hasBeenStarted) {
        computation.stop();
        mobxDisposer();
      }
    }
  };
};
