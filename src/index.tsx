import template from 'babel-template';
import generate from '@babel/generator';
import * as babylon from 'babylon';

process.env.BABEL_DISABLE_CACHE = '1';
// import generate from 'babel-generator';

// var [IMPORT_NAME] = require(SOURCE);
//   var ____useWhatChanged = IMPORT_NAME.useWhatChanged

/**
 *
 * Check whether the dependency item is an object. then
 */
const isObject = (t: any) => {
  return Object.prototype.toString.call(t) === '[object Object]';
};
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
        if (!state.opts.active) return;
        if (
          SetToSupport.indexOf(path.node.name) !== -1 &&
          isObject(state.lineNoWhereCallNeedToBeAdded)
        ) {
          Object.keys(state.lineNoWhereCallNeedToBeAdded).forEach(lineNo => {
            if (!state.lineNoWhereCallNeedToBeAdded[lineNo].done) {
              if (
                parseInt(path.node.loc.start.line, 10) ===
                parseInt(lineNo) + 1
              ) {
                const parentMemberCallExpression = path.findParent(
                  (path: any) => path.isCallExpression()
                );
                const bodyPath = path.findParent(
                  (path: any) => path.parent.type === 'BlockStatement'
                );

                const parentNode = parentMemberCallExpression.node;

                const dependencyArgs = parentNode.arguments[1];
                // console.log('generate(elem)', generate(dependencyArgs).code);
                if (dependencyArgs) {
                  if (
                    dependencyArgs.type === 'ArrayExpression' &&
                    dependencyArgs.elements.length > 0
                  ) {
                    const collectedNames = generate(dependencyArgs).code;
                    // const collectedNames = dependencyArgs.elements.reduce(
                    //   (acc: any, elem: any) => {
                    //     // if(t.isIdentifier(elem)) {
                    //     //   acc.push(elem.name);
                    //     // }

                    //     acc.push(elem.name);
                    //     return acc;
                    //   },
                    //   []
                    // );

                    // const templateuseWhatChangedFUnctionCall = `
                    // ____useWhatChanged([${collectedNames.join(
                    //   ','
                    // )}], "${collectedNames.join(',')}")
                    // `;
                    const templateuseWhatChangedFUnctionCall = `
                     ____useWhatChanged(${collectedNames},"${collectedNames.slice(
                      1,
                      -1
                    )}")
                     `;
                    const useWhatChangedAst = babylon.parse(
                      templateuseWhatChangedFUnctionCall
                    );
                    state.lineNoWhereCallNeedToBeAdded[
                      lineNo
                    ].collectionNames = collectedNames;
                    try {
                      // path.unshiftContainer('body', useWhatChangedAst);
                      bodyPath.insertBefore(useWhatChangedAst);
                    } catch (e) {
                      console.log('parentMemberCallExpressione', e);
                    }

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
          if (!state.opts.active) return;
          try {
            path.container.comments.forEach((commentObj: any) => {
              if (commentObj.value.trim() === 'uwc-debug') {
                if (!state.isDoneAddingImport) {
                  const ast = buildRequire({
                    IMPORT_NAME: t.identifier(
                      'simbathesailor_useWhatChangedImport'
                    ),
                    SOURCE: t.stringLiteral('@simbathesailor/use-what-changed'),
                  });
                  try {
                    path.unshiftContainer('body', ast);
                  } catch (e) {
                    console.log('error adding import to body');
                  }

                  state.isDoneAddingImport = true;
                }
                if (
                  isObject(state) &&
                  isObject(state.lineNoWhereCallNeedToBeAdded)
                ) {
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
          } catch (e) {
            console.log('error', e);
          }
        },
      },
    },
  };
}

module.exports = Test;
