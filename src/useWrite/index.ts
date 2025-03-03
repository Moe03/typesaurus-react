import type { TypesaurusCore } from "typesaurus";
import { useState, useCallback } from "../adapter/index.js";
import type { TypesaurusReact } from "../types.js";

export interface WriteOptions {
  merge?: boolean;
}

export function useWrite<
  Ref extends TypesaurusCore.Ref<TypesaurusCore.DocDef> | TypesaurusCore.Doc<TypesaurusCore.DocDef, TypesaurusCore.DocProps>,
>(): [
  (
    ref: Ref,
    data: Ref extends TypesaurusCore.Ref<infer Def extends TypesaurusCore.DocDef>
      ? TypesaurusCore.AssignArg<
          TypesaurusCore.UnionVariableModelType<Def["WideModel"]>,
          TypesaurusCore.DocProps
        >
      : Ref extends TypesaurusCore.Doc<infer Def extends TypesaurusCore.DocDef, any>
      ? TypesaurusCore.AssignArg<
          TypesaurusCore.UnionVariableModelType<Def["WideModel"]>,
          TypesaurusCore.DocProps
        >
      : never,
    options?: WriteOptions
  ) => Promise<Ref extends TypesaurusCore.Ref<infer Def extends TypesaurusCore.DocDef> ? TypesaurusCore.Ref<Def> : Ref extends TypesaurusCore.Doc<infer Def extends TypesaurusCore.DocDef, any> ? TypesaurusCore.Ref<Def> : never>,
  TypesaurusReact.HookResult<null>[1]
] {
  const [status, setStatus] = useState<{
    loading: boolean;
    error: unknown;
  }>({
    loading: false,
    error: undefined,
  });

  const write = useCallback(
    async <T extends Ref>(
      ref: T,
      data: T extends TypesaurusCore.Ref<infer Def extends TypesaurusCore.DocDef>
        ? TypesaurusCore.AssignArg<
            TypesaurusCore.UnionVariableModelType<Def["WideModel"]>,
            TypesaurusCore.DocProps
          >
        : T extends TypesaurusCore.Doc<infer Def extends TypesaurusCore.DocDef, any>
        ? TypesaurusCore.AssignArg<
            TypesaurusCore.UnionVariableModelType<Def["WideModel"]>,
            TypesaurusCore.DocProps
          >
        : never,
      options?: WriteOptions
    ) => {
      setStatus({ loading: true, error: undefined });
      try {
        const result = options?.merge
          ? await ref.upset(data)
          : await ref.set(data);
        setStatus({ loading: false, error: undefined });
        return result as T extends TypesaurusCore.Ref<infer Def extends TypesaurusCore.DocDef> 
          ? TypesaurusCore.Ref<Def> 
          : T extends TypesaurusCore.Doc<infer Def extends TypesaurusCore.DocDef, any> 
          ? TypesaurusCore.Ref<Def> 
          : never;
      } catch (error) {
        setStatus({ loading: false, error });
        throw error;
      }
    },
    [setStatus]
  );

  return [write, status];
}
