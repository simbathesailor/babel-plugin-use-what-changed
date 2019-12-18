import template from 'babel-template';
import * as babylon from 'babylon';

process.env.BABEL_DISABLE_CACHE = '1';
// import generate from 'babel-generator';

// var [IMPORT_NAME] = require(SOURCE);
//   var ____useWhatChanged = IMPORT_NAME.useWhatChanged
const buildRequire = template(`
  var IMPORT_NAME = require(SOURCE);
  var ____useWhatChanged = IMPORT_NAME.useWhatChanged
`);

const SetToSupport = ['useEffect', 'useCallback', 'useMemo'];

function Test(babel: any) {
  const { types: t } = babel;
  return {
    visitor: {
      Identifier(path: any, state: any) {
        if (SetToSupport.indexOf(path.node.name) !== -1) {
          Object.keys(state.lineNoWhereCallNeedToBeAdded).forEach(lineNo => {
            if (!state.lineNoWhereCallNeedToBeAdded[lineNo].done) {
              if (
                parseInt(path.node.loc.start.line, 10) ===
                parseInt(lineNo) + 1
              ) {
                const parentMemberCallExpression = path.findParent(
                  (path: any) => path.isCallExpression()
                );

                const parentNode = parentMemberCallExpression.node;
                const dependencyArgs = parentNode.arguments[1];
                if (dependencyArgs) {
                  if (
                    dependencyArgs.type === 'ArrayExpression' &&
                    dependencyArgs.elements.length > 0
                  ) {
                    const collectedNames = dependencyArgs.elements.reduce(
                      (acc: any, elem: any) => {
                        acc.push(elem.name);
                        return acc;
                      },
                      []
                    );

                    const templateuseWhatChangedFUnctionCall = `
                    ____useWhatChanged([${collectedNames.join(
                      ','
                    )}], "${collectedNames.join(',')}")
                    `;
                    const useWhatChangedAst = babylon.parse(
                      templateuseWhatChangedFUnctionCall
                    );
                    state.lineNoWhereCallNeedToBeAdded[
                      lineNo
                    ].collectionNames = collectedNames;

                    parentMemberCallExpression.insertBefore(useWhatChangedAst);
                    state.lineNoWhereCallNeedToBeAdded[lineNo].done = true;
                  }
                }
              }
            }
          });
        }
      },

      Program: {
        exit: function() {},
        enter: function(path: any, state: any) {
          path.container.comments.forEach((commentObj: any) => {
            if (commentObj.value.trim() === 'uwc-debug') {
              if (!(state.myOwn === 'doneAddingImport')) {
                const ast = buildRequire({
                  IMPORT_NAME: t.identifier(
                    'simbathesailor_useWhatChangedImport'
                  ),
                  SOURCE: t.stringLiteral('@simbathesailor/use-what-changed'),
                });

                path.unshiftContainer('body', ast);
                state.isDoneAddingImport = true;
              }
              if (state.lineNoWhereCallNeedToBeAdded) {
                state.lineNoWhereCallNeedToBeAdded = Object.assign(
                  {},
                  state.lineNoWhereCallNeedToBeAdded,
                  {
                    [commentObj.loc.start.line]: {
                      done: false,
                    },
                  }
                );
              } else {
                state.lineNoWhereCallNeedToBeAdded = {
                  [commentObj.loc.start.line]: {
                    done: false,
                  },
                };
              }
            }
          });
        },
      },
    },
  };
}

module.exports = Test;
