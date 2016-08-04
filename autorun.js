import { Tracker } from 'meteor/tracker';
import { autorun } from 'mobx';

export default (trackerMobxAutorun) => {
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
            trackerMobxAutorun();
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
