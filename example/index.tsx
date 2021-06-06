import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Sample from './Sample';
import './styles.css';
//ljknsxcscadjuwc-debug-below
const { useMemo } = React;
// skjhjbjjhjvbh
function Child1(props) {
  const { c, d } = props;

  const finalObject = { a: 3 };
  const isSelectedValueInOption = [{ a: 1 }, { a: 2 }]?.find(each => {
    return each.a === finalObject.a;
  });
  const obj = {
    h: 2,
  };

  // uwc-debug
  React.useEffect(() => {}, []);

  // uwc-debug
  React.useEffect(() => {}, [c, d, isSelectedValueInOption?.a]);

  // uwc-debug
  React.useLayoutEffect(() => {}, [d]);

  // uwc-debugsadsaasadsasa
  // const testFn = React.useCallback(() => {}, ['a', 'b']);
  return (
    <div className="child1">
      <span>CHILD 1</span>
      <span>Value c: {c}</span>
      <span>Value d: {d}</span>
    </div>
  );
}

function Child2(props) {
  const { a } = props;
  const e = 5;
  React.useEffect(() => {}, [a, e]);

  return (
    <div className="child2">
      <span>CHILD 2</span>
      <span>Value a: {a}</span>
    </div>
  );
}

function App() {
  const [a, setA] = React.useState(0);
  const [b, setB] = React.useState(0);
  const [c, setC] = React.useState(0);
  const [d, setD] = React.useState(0);

  // uwc-debugsas
  React.useEffect(() => {
    // console.log("some thing changed , need to figure out")
  }, [a, b, c, d]);

  const myObj = { a: 'a', b: 'd' };
  const myArr = ['a', 'b', 'c'];
  // uwc-debugsdads
  React.useEffect(() => {
    // console.log("some thing changed , need to figure out")
  }, [a, b, myObj.a]);

  // useWhat  Changed();
  // useWhatChanged([]);
  // sxauwc-debug-below
  // uwc-debug
  const m = useMemo(() => {
    console.log('hi');
  }, [a]);

  // uwc-debugjnjkk

  const testFnCallback = React.useCallback(() => {
    console.log('test fn');
  }, [d, c]);

  return (
    <div className="container">
      <h1 className="title">Open devtools and observer console tab logs</h1>
      <h3 className="title">Click to change values and see logs</h3>
      {m}
      <div
        style={{
          fontSize: '30px',
          fontWeight: 'bold',
          marginBottom: '20px',
        }}
      >
        <span className="cr_value">a: {a}</span>
        <span className="cr_value">b: {b}</span>
        <span className="cr_value">c: {c}</span>
        <span className="cr_value">d: {d}</span>
      </div>
      <div>
        <button
          className="action-btn"
          onClick={() => {
            setA(a + 1);
          }}
        >
          Change A
        </button>
        <button
          className="action-btn"
          onClick={() => {
            setA(a + 1);
            setB(b + 1);
          }}
        >
          Change A & B
        </button>
        <button
          className="action-btn"
          onClick={() => {
            setA(a + 1);
            setD(d + 1);
          }}
        >
          Change A & D
        </button>
      </div>
      <div>
        <button
          className="action-btn"
          onClick={() => {
            setC(c + 1);
          }}
        >
          Change C
        </button>
        <button
          className="action-btn"
          // style={{
          //   background: 'linear-gradient(15deg,#14af83,#15b89a)',
          // }}
          onClick={() => {
            setB(b + 1);
            setC(c + 1);
          }}
        >
          Change B & C
        </button>
      </div>

      <div style={{ display: 'flex' }}>
        <Child1 c={c} d={d}></Child1>
        <Child2 a={a}></Child2>
      </div>
      <Sample></Sample>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
