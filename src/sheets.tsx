import {registerSheet, SheetDefinition} from 'react-native-actions-sheet';
import SnapMe from './components/sheets/snap-me';
import NestedSheet from './components/sheets/nested';
// import ExampleSheet from 'example-sheet.tsx';

registerSheet('snap-me', SnapMe);
registerSheet('nested-sheets', NestedSheet);

// We extend some of the types here to give us great intellisense
// across the app for all registered sheets.
declare module 'react-native-actions-sheet' {
  interface Sheets {
    'snap-me': SheetDefinition;
    'nested-sheets': SheetDefinition;
  }
}

export {};
