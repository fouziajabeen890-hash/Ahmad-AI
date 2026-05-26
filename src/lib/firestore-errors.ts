export enum OperationType {
  GET = 'read',
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  WRITE = 'write'
}

export function handleFirestoreError(error: any, operation: OperationType, path: string) {
  console.error(`Firestore ${operation} error on path ${path}:`, error);
  // Additional logic can be added here if needed to display errors to users
}
