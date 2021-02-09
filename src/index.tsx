import template from 'babel-template';
import generate from '@babel/generator';
import * as babylon from 'babylon';
import path from 'path';

const nodePath = path;

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

const SetToSupport = ['useEffect', 'useCallback', 'useMemo', 'useLayoutEffect'];

function transformCode({
  lineNo,
  state,
  path,
}: {
  lineNo: any;
  state: any;
  path: any;
}) {
  // console.log('TCL: Identifier -> lineNoWhereCallNeedToBeAdded', lineNo);
  const parentMemberCallExpression = path.findParent((path: any) =>
    path.isCallExpression()
  );

  if (!parentMemberCallExpression) {
    // return is the it is not a call expression
    return;
  }
  const bodyPath = path.findParent(
    (path: any) => path.parent.type === 'BlockStatement'
  );

  const parentNode = parentMemberCallExpression.node;

  const dependencyArgs = parentNode.arguments[1];
  if (dependencyArgs) {
    if (
      dependencyArgs.type === 'ArrayExpression'
      // dependencyArgs.elements.length > 0
    ) {
      const collectedNames = generate(dependencyArgs, {
        shouldPrintComment: () => false,
      }).code;
      // const parsedPath = nodePath.parse(state.file.opts.filename);
      // console.log('current working directory', path.node.loc.start.line);

      // const currentWorkingDirectory = nodePath
      //   .dirname(state.file.opts.filename)
      //   .split(nodePath.sep)
      //   .pop();
      const splittedPath = state.file.opts.filename.split(nodePath.sep);
      const templateuseWhatChangedFUnctionCall = `
       ____useWhatChanged(${collectedNames},"${collectedNames.slice(
        1,
        -1
      )}", "${path.node.name}::${splittedPath.slice(-2).join('/')}")
       `;

      const useWhatChangedAst = babylon.parse(
        templateuseWhatChangedFUnctionCall
      );
      if (
        state.lineNoWhereCallNeedToBeAdded &&
        state.lineNoWhereCallNeedToBeAdded[lineNo]
      ) {
        state.lineNoWhereCallNeedToBeAdded[
          lineNo
        ].collectionNames = collectedNames;
      }

      try {
        // path.unshiftContainer('body', useWhatChangedAst);
        bodyPath.insertBefore(useWhatChangedAst);
      } catch (e) {
        console.error('@simbathesailor-uwc-debug error', e);
      }
      if (
        state.lineNoWhereCallNeedToBeAdded &&
        state.lineNoWhereCallNeedToBeAdded[lineNo]
      ) {
        state.lineNoWhereCallNeedToBeAdded[lineNo].done = true;
      }
    }
  }
}
function Test(babel: any) {
  const { types: t } = babel;
  return {
    visitor: {
      Identifier(path: any, state: any) {
        console.log('Identifier -> path', path);
        if (!state.opts.active) return;
        if (
          SetToSupport.indexOf(path.node.name) !== -1
          // isObject(state.lineNoWhereCallNeedToBeAdded)
        ) {
          // Handling the uwc-debug-below
          if (
            state.lowerlimituwcdebug !== undefined &&
            parseInt(path?.node?.loc?.start?.line, 10) >
              state.lowerlimituwcdebug
          ) {
            const lineToInsert = parseInt(path.node.loc.start.line, 10) - 1;
            transformCode({
              lineNo: lineToInsert,
              path,
              state,
            });
            if (!state.lineNoWhereCallNeedToBeAdded) {
              state.lineNoWhereCallNeedToBeAdded = {};
            }
            if (!state.lineNoWhereCallNeedToBeAdded[lineToInsert]) {
              state.lineNoWhereCallNeedToBeAdded = {
                [lineToInsert]: {
                  done: false,
                },
              };
            }

            state.lineNoWhereCallNeedToBeAdded[lineToInsert].done = true;
          }
          if (isObject(state.lineNoWhereCallNeedToBeAdded)) {
            Object.keys(state.lineNoWhereCallNeedToBeAdded).forEach(lineNo => {
              if (!state.lineNoWhereCallNeedToBeAdded[lineNo].done) {
                if (
                  parseInt(path?.node?.loc?.start?.line, 10) ===
                  parseInt(lineNo) + 1
                ) {
                  transformCode({ lineNo, state, path });
                }
              }
            });
          }
        }
      },

      Program: {
        exit: function() {},
        enter: function(path: any, state: any) {
          let uwcDebugBelowEncountered = false;
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
                    console.error(
                      '@simbathesailor-uwc-debug error adding import',
                      e
                    );
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
              // Need to add logic for uwc-debug-below
              if (
                commentObj.value.trim() === 'uwc-debug-below' &&
                !uwcDebugBelowEncountered
              ) {
                ////
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
                    console.error(
                      '@simbathesailor-uwc-debug error adding import',
                      e
                    );
                  }

                  state.isDoneAddingImport = true;
                }
                ////
                state.lowerlimituwcdebug = commentObj.loc.start.line;
                uwcDebugBelowEncountered = true;
              }
            });
          } catch (e) {
            console.error('@simbathesailor-uwc-debug error', e);
          }
        },
      },
    },
  };
}

module.exports = Test;
