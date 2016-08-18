import { Tracker } from 'meteor/tracker';
import { action } from 'mobx';

export default (actionPrefix = '', observableArray, handle, cursor) => {

  if (handle.ready()) {
    // initial fetch...
    Tracker.nonreactive(() => {
      action(`${actionPrefix}: initial fetch`, (comments) => {
        observableArray.replace(comments);
      })(cursor.fetch());
    });

    // ...and then observe
    cursor.observe({
      // we don't want that the addedAt function is triggered x times at the beginning
      // just fetch them once (see above)
      _suppress_initial: true,
      addedAt: action(`${actionPrefix}: document added`, (document, atIndex) => {
        observableArray.splice(atIndex, 0, document);
      }),
      changedAt: action(`${actionPrefix}: document changed`, (newDocument, oldDocument, atIndex) => {
        observableArray.splice(atIndex, 1, newDocument);
      }),
      removedAt: action(`${actionPrefix}: document removed`, (oldDocument, atIndex) => {
        observableArray.splice(atIndex, 1);
      }),
      movedTo: action(`${actionPrefix}: document moved`, (document, fromIndex, toIndex) => {
        observableArray.splice(fromIndex, 1);
        observableArray.splice(toIndex, 0, document);
      }),
    });
  } else {
    action(`${actionPrefix}: initialized`, () => {
      observableArray.clear();
    })();
  }
};
