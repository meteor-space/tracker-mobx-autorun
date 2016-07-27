# Tracker MobX autorun

_Integrate Meteor reactive data 
([Tracker-aware reactive data sources](https://github.com/meteor/meteor/blob/devel/packages/tracker/README.md#tracker-aware-libraries-from-the-meteor-project))
with [MobX](https://mobxjs.github.io/mobx/) for simple yet highly
optimized state management_

MobX and [Tracker](https://docs.meteor.com/api/tracker.html#Tracker-autorun) can both [autorun](https://mobxjs.github.io/mobx/refguide/autorun.html) code when a dependency changes, however caching a copy of Meteor reactive data in a MobX store requires a significant amount of boilerplate. This package handles the complexity and provides an `autorun` that can be triggered by a change to _either_ a MobX [observable](https://mobxjs.github.io/mobx/refguide/observable.html) _or_ Meteor reactive data source.

### Usage

```javascript
// my-store.js
import { observable } from 'mobx';

export default observable({
  selectedProjectId: null,
  projectTodos: []
});

// autorun/todos.js
import state from '../my-store';
import * as Collections from '../../infrastructure/collections';
import { Meteor } from 'meteor/meteor';

export default () => {
  const projectId = state.selectedProjectId;
  Meteor.subscribe('todos', {projectId});
  state.projectTodos = Collections.Todos.find({projectId}).fetch();
};

// index.js
import autorun from 'meteor/space:tracker-mobx-autorun';
import todos from './autorun/todos';

export const todosAutorun = autorun(todos);

Meteor.startup(function() {
  if (Meteor.isClient) {
    todosAutorun.start();
  }
});

```

### Usage with MobX _strict mode_
Using MobX [actions](https://mobxjs.github.io/mobx/refguide/action.html)
is mandatory when strict mode is enabled.

```javascript
// index.js - enabling MobX strict mode
import { useStrict } from 'mobx';
useStrict(true);

// actions/projects.js
import state from '../store';
import { action } from 'mobx';

export const selectProject = action('selectProject', (projectId) => {
  state.selectedProjectId = projectId;
});

// autorun/todos.js
import state from '../my-store';
import * as Collections from '../../infrastructure/collections';
import { Meteor } from 'meteor/meteor';
import { action } from 'mobx';

export default () => {
  const projectId = state.selectedProjectId;
  Meteor.subscribe('todos', {projectId});
  action('updateTodosFromAutorun', (todos) => {
    state.projectTodos = todos;
  })(projectId ? Collections.Todos.find({projectId}).fetch() : []);
};

```

## Before and After
![aNativ image](trello-card.png?raw=true)
_Trello card from April 2016 - Before and after refactoring_

- React container component displays the currently selected project name.
- Original implementation used Tracker.Component.
- Application code for managing subscriptions and client state was reduced by 80%
- Number of unnecessary re-renderings reduced to 0 thanks to mobx-react `observer`,
[this post](https://github.com/mobxjs/mobx/issues/101#issuecomment-220891704)
explains how to use it properly.

## Installation

`meteor add space:tracker-mobx-autorun`

`npm install --save mobx mobx-react`

_Meteor 1.3 +_


Developed with sponsorship from [dyzio - social video marketing made easy](https://www.dyzio.co)