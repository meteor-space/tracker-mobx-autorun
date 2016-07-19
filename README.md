# Meteor.Tracker/MobX Autorun

**Meteor.Tracker and MobX integration**

*MobX is awesome* for state management but if you are using it
in a Meteor application for managing client side reactive state it would be a shame 
not to leverage Tracker and Meteors Tracker-aware reactive data sources such as Minimongo.

This package glues Meteor.Tracker and MobX autorun and enables 
writing autorun functions that depend on Meteor reactive data sources
and/or MobX observables.

> Why is writing Tracker.autoruns not enough when the state is being managed by MobX?

One reactive state needs to invalidate/dispose the other, without that Tracker.autorun
would receive only initial values.

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
import store from '../my-store';
import * as Collections from '../../infrastructure/collections';
import { Meteor } from 'meteor/meteor';

export default () => {
  const state = store.getState();
  const projectId = store.selectedProjectId;
  
  Meteor.subscribe('todos', {projectId});
  state.projectTodos = Collections.Todos.find({projectId}).fetch();
};
```

**3. Start your Tracker/MobX autorun:**

```javascript
import autorun from 'meteor/space:tracker-mobx-autorun';
import todosAutorun from './autoruns/todos';

Meteor.startup(function() {
  if (Meteor.isClient) {
    autorun(todosAutorun).start();
  }
});

```

