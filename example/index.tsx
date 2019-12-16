import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

const App = () => {
  // comment hsxsslklbccbzc
  // uwc-debug
  React.useEffect(() => {
    console.log('I will run on every render');
  }, []);

  // uwc-debug
  React.useEffect(() => {
    console.log('I will run on every render');
  }, []);
  return <div>Hello world</div>;
};

ReactDOM.render(<App />, document.getElementById('root'));
