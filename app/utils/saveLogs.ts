import RNFS from 'react-native-fs';

export const saveToLogFile = (
  datetime: string,
  path: string,
  exceptionMethod?: string,
  bug?: any,
  message?: string,
) => {
  if (bug !== undefined && bug.isAxiosError && exceptionMethod?.length) {
    let requestStringTemplate =
      '[' +
      datetime +
      ']' +
      'Method: ' +
      exceptionMethod +
      '. Type: Axios Error. Response status:' +
      JSON.stringify(bug.response.status) +
      '. Response data:' +
      JSON.stringify(bug.response.data) +
      '. Request: ' +
      JSON.stringify(bug.request) +
      '\n';
    RNFS.appendFile(path, requestStringTemplate).catch(error =>
      console.log('failed to append in logfile', error),
    );
    return;
  }

  if (bug !== undefined && bug instanceof Error) {
    let otherError =
      '[' +
      datetime +
      ']' +
      'Method: ' +
      exceptionMethod +
      '. Trace: ' +
      JSON.stringify(bug.stack) +
      '\n';
    RNFS.appendFile(path, otherError).catch(error =>
      console.log('failed to append in logfile', error),
    );
    return;
  }
  if (message?.length) {
    let content = '[' + datetime + ']' + 'Log:' + message + '\n';
    RNFS.appendFile(path, content).catch(error =>
      console.log('failed to append in logfile', error),
    );
    return;
  }
};
