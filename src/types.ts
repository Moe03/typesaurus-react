import type { TypesaurusUtils } from "@tixae-labs/typesaurus";

export namespace TypesaurusReact {
  export type HookInput<Type> = Type | TypesaurusUtils.Falsy;

  export type HookResult<Result, ExtraMeta = {}> = readonly [
    result: Result,
    meta: { loading: boolean; error: unknown } & ExtraMeta,
  ];

  export type HookLazyUse<Result, ExtraMeta = {}> = (
    evaluate?: boolean,
  ) => HookResult<Result, ExtraMeta>;
}
