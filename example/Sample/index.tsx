import * as React from 'react';

function Test(props) {
  const { c, d, a, m } = props;
  // jkhjhbj
  React.useEffect(() => {}, [c, d]);

  //onuwc-debug-below
  // uwc-debug-below
  React.useEffect(() => {}, [a, m]);
  return <div>Hello TEST</div>;
}
//jkbb
export default Test;
