import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

const App = () => {
  // comment hsadclpfcsdf
  const a = 1;
  const b = 2;

  function A() {
    console.log('Testing the plugin');
  }
  // uwc-debug
  React.useEffect(() => {
    console.log('I will run on every render');
  }, [a, b]);

  // uwc-debug
  React.useEffect(() => {
    console.log('I will run on every render');
  }, [b, a]);

  // uwc-debug
  React.useCallback(() => {
    console.log('I will run on every render');
  }, [b, A]);

  // uwc-debug
  React.useMemo(() => {
    console.log('I will run on every render');
  }, [b]);

  return <div>Hello world</div>;
};

ReactDOM.render(<App />, document.getElementById('root'));
