import React from 'react';
import A4N from './app/screens/A4NScreen';
import { Provider } from 'react-redux'
import Store from './app/store/a4nStore'

class App extends React.Component {
    //Very first method called from the application :
    constructor(props){
        super(props);
    }
  render() {
    return (
        <Provider store={Store}>
          <A4N />
        </Provider>
    )
  }
}

export default App;