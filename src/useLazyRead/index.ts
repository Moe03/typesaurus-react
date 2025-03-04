import type { TypesaurusCore as Core } from "@tixae-labs/typesaurus";
import { useState, useCallback } from "../adapter/index.js";
import type { TypesaurusReact as React } from "../types.js";
import { useRead } from "../index.js";

export function useLazyRead<
  Request extends Core.Request<any>,
  Result,
  SubscriptionMeta = undefined,
>(
  query: React.HookInput<
    | Core.SubscriptionPromise<Request, Result, SubscriptionMeta>
    | Core.SubscriptionPromiseOn<Request, Result, SubscriptionMeta>
  >,
): React.HookLazyUse<Result | undefined> {
  const [evaluate, setEvaluate] = useState(false);
  const result = useRead(evaluate && query);
  const lazyEval = useCallback(
    (hookEvaluate?: boolean) => {
      !evaluate && hookEvaluate !== false && setEvaluate(true);
      return result;
    },
    [evaluate, result],
  );
  return lazyEval;
}

export const dummyLazyReadHook: React.HookLazyUse<any> = () => [
  undefined,
  { loading: true, error: undefined },
];
