# Meteor.Tracker/MobX Autorun

**Meteor.Tracker and MobX integration**

*MobX is awesome* for state management but if you are using it
in a Meteor application for managing client side reactive state it would be a shame 
not to leverage Tracker and Tracker-aware reactive data sources such as Minimongo.

This package glues Meteor.Tracker and MobX autorun and enables 
writing autorun functions that depend on Meteor reactive data sources
and/or MobX observables.

> Why is writing Tracker.autoruns not enough when the state is being managed by MobX?

One reactive state needs to invalidate/dispose the other, without that Tracker.autorun
would receive only initial values.

## Motivation
![aNativ image](trello-card.png?raw=true)

## Installation

`meteor add space:tracker-mobx-autorun`

*Compatible with `Meteor 1.3.x - 1.4.x`*

`meteor npm install mobx`

## Usage

**1. Make UI state MobX observable:**

```javascript
// my-store.js
import { observable } from 'mobx';

export default store = observable({
  selectedProjectId: null,
  projectTodos: []
});

```

**2. Write autorun function that depends on Meteor reactive data source:**

```javascript
// autoruns/todos.js
import state from '../my-store';
import * as Collections from '../../infrastructure/collections';
import { Meteor } from 'meteor/meteor';

export default () => {
  const projectId = state.selectedProjectId;
  Meteor.subscribe('todos', {projectId});
  state.projectTodos = Collections.Todos.find({projectId}).fetch();
};
```

**3. Starting Tracker/MobX autorun:**

```javascript
// index.js
import autorun from 'meteor/space:tracker-mobx-autorun';
import todos from './autoruns/todos';

export const todosAutorun = autorun(todos);

Meteor.startup(function() {
  if (Meteor.isClient) {
    todosAutorun.start();
  }
});
```

**4. Stopping Tracker/MobX autorun:**

```javascript
import { todosAutorun } from '../index';

todosAutorun.stop();
```

Developed with sponsorship from [dyzio - social video marketing made easy](https://www.dyzio.co)