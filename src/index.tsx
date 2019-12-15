import template from 'babel-template';

process.env.BABEL_DISABLE_CACHE = '1';
// import generate from 'babel-generator';

const buildRequire = template(`
  var [IMPORT_NAME] = require(SOURCE);
  var ____useWhatChanged = IMPORT_NAME.useWhatChanged
`);

const SetToSupport = ['useEffect', 'useCallback', 'useMemo'];

function Test(babel: any) {
  // console.log('TCL: Test -> babel', babel.types);
  const { types: t } = babel;
  // console.log('t', t);
  // plugin contents
  return {
    visitor: {
      Identifier: {
        exit(path: any) {
          if (SetToSupport.indexOf(path.node.name) !== -1) {
            console.log('path.node.name', path.node.name);
          }
        },
      },
      Program: {
        enter(path: any) {
          console.log('path.nodesadddcasdc', t, path.get('body'));

          path.container.comments.map((commentObj: any) => {
            if (commentObj.value.trim() === 'uwc-debug') {
              const ast = buildRequire({
                IMPORT_NAME: t.identifier(
                  'simbathesailor_useWhatChangedImport'
                ),
                SOURCE: t.stringLiteral('@simbathesailor/use-what-changed'),
              });

              path.unshiftContainer('body', ast);
              console.log(commentObj.type, commentObj.value, commentObj);
            }
          });
        },
      },
    },
  };
}

module.exports = Test;
