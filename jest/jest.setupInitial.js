// Step 1 of fix for "You called act(async () => ...) without await" error:
// https://github.com/callstack/react-native-testing-library/issues/379#issuecomment-714341282
// @ts-ignore
global.originalPromise = Promise
