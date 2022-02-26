# Matico Components 

This project contains all the components needed to build a Matico App, the MaticoApp component it'self and the editor set up to modify components.

## Building the library 

First install dependencies:

```sh
yarn install
```

To run in hot module reloading mode:

```sh
yarn run build-dev
```

To create a production build:

```sh
yarn run build-prod
```

## Using the individual components 

Each component can be used by itself disconected from the rest. Simple import it and use it like any other React component. 

## Bring your own components 

While we have built each of the components within Matico to work well together, we know that you might want to replace them with your own. We are currently working on a depdendency injection system to allow you do just that. This would allow you to develop your own version of say a MaticoScatterPlotPane or MaticoMapPane and as long as it conforms to the interface of that Pane type, you should be able to easily swap it out.

## Embedding a MaticoApp in your codebase 

Each of the components can be used independently of one another or used in combination as a MaticoApp. To embed a MaticoApp on your own application simply install @maticoapp/matico\_components using 

```bash
yarn add @maticoapp/matico_components
```

then place the MaticoApp component as follows 

```jsx
import {MaticoApp} from '@maticoapp/matico_components'

export const AppContainer : React.FC<> = ()=>{
  return (
      <MaticoApp 
        spec={spec}
        basename={"http://yoursiteurl.com/path/to/embed/page"}
      />
  )
}
```
where spec is an instance of a MaticoAppSpec (see docs site for more info) and basename is the path to the root page the app is embeded in (MaticoApp will use prefixed to that url to handle internal routing).


### Interacting with MaticoApp
If you want to have the rest of your app respone to events within Matio, for example new datasets being registered, the Matico state changing, you can do so by passing MaticoApp callbacks as so 


```jsx
import {MaticoApp} from '@maticoapp/matico_components'

export const AppContainer : React.FC<> = ()=>{
  return (
      <MaticoApp 
        spec={spec}
        basename={"http://yoursiteurl.com/path/to/embed/page"}
        onStateChange?: (state: VariableState) => void;
        onDataChange?: (data: MaticoDataState) => void;
        onSpecChange?: (data: Dashboard) => void;
      />
  )
}
```

where 

- onStateChange will fire whenever something in the app state changes
- onDataChange will fire whenever the known datasets update (load etc)
- onSpecChange will fire whenever the app specification changes.

### Registering other data providers.

Matico can consume data from a number of sources however we know that you will likely want to extend that to other sources. To allow for this you can pass through an array of additional DataProviders to MaticoApp which will populate the Add Dataset pane within the editor.  



```jsx 

import {MaticoApp} from '@maticoapp/matico_components'
import {MyDatasetProvider} from 'providers/MyDatasetProvider'

export const AppContainer : React.FC<> = ()=>{
  return (
      <MaticoApp 
        spec={spec}
        basename={"http://yoursiteurl.com/path/to/embed/page"}
        onStateChange= {(state: VariableState) => console.log(state)};
        onDataChange={(data: MaticoDataState) => console.log(data)};
        onSpecChange={(spec: Dashboard) => console.log(spec);
        datasetProviders= [MyDatasetProvider ]; 
      />
  )
}
```

DatasetProviders must implement the DatasetProvider interface 

```jsx

export interface DatasetProviderComponent{
  onSubmit : (datasetDetails: any) =>void
}

export interface DatasetProvider {
  name: string;
  description: string;
  component: React.FC<DatasetProviderComponent>;
}
```

Where DatasetProviderComponent describes the interface that needs to be implmented to produce the UI fro adding this dataset type 

```jsx

```

