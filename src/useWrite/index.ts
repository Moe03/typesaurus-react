import type { TypesaurusCore } from "@tixae-labs/typesaurus";
import { useState, useCallback } from "../adapter/index.js";
import type { TypesaurusReact } from "../types.js";

type WriteFunction<T> = 
  // Handle direct refs
  T extends TypesaurusCore.Ref<infer Def> 
    ? (data: TypesaurusCore.AssignArg<TypesaurusCore.UnionVariableModelType<Def["WideModel"]>, TypesaurusCore.DocProps>) => Promise<TypesaurusCore.Ref<Def>>
  // Handle direct docs
  : T extends TypesaurusCore.Doc<infer Def, any>
    ? (data: TypesaurusCore.AssignArg<TypesaurusCore.UnionVariableModelType<Def["WideModel"]>, TypesaurusCore.DocProps>) => Promise<TypesaurusCore.Ref<Def>>
  // Handle collections
  : T extends TypesaurusCore.Collection<infer Def>
    ? (data: TypesaurusCore.AssignArg<TypesaurusCore.UnionVariableModelType<Def["Model"]>, TypesaurusCore.DocProps>) => Promise<TypesaurusCore.Ref<Def>>
  // Handle collection function results (db.users('id'))
  : T extends { type: "ref"; id: infer Id; collection: TypesaurusCore.Collection<infer Def> }
    ? (data: TypesaurusCore.AssignArg<TypesaurusCore.UnionVariableModelType<Def["WideModel"]>, TypesaurusCore.DocProps>) => Promise<TypesaurusCore.Ref<Def>>
  // Handle nested collection function results
  : T extends { type: "collection"; schema: infer Schema }
    ? (data: any) => Promise<any>
  // Fallback
  : (data: any) => Promise<any>;

export function useWrite<T>(
  docRef: T
): [
  WriteFunction<T>,
  boolean,
  unknown
] {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(undefined);

  const write = useCallback(
    (data: any) => {
      setLoading(true);
      setError(undefined);
      
      return new Promise((resolve, reject) => {
        const executeWrite = async () => {
          try {
            let result;
            console.log(`input doc ref? `, docRef);
            if (typeof docRef === 'object' && docRef !== null) {
              if ('set' in docRef && typeof docRef.set === 'function') {
                result = await docRef.set(data);
              } else if ('update' in docRef && typeof docRef.update === 'function') {
                result = await docRef.update(data);
              } else {
                throw new Error('Document reference does not support writing operations');
              }
            } else {
              throw new Error('Invalid document reference');
            }
            
            setLoading(false);
            resolve(result);
          } catch (err) {
            setLoading(false);
            setError(err);
            reject(err);
          }
        };
        
        executeWrite();
      });
    },
    [docRef, setLoading, setError]
  );

  return [write as WriteFunction<T>, loading, error];
}