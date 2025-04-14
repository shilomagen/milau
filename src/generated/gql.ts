/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "query GetBoard($boardId: ID!) {\n  boards(ids: [$boardId]) {\n    id\n    name\n    description\n    columns {\n      id\n      title\n      type\n    }\n    items_count\n    groups {\n      id\n      title\n    }\n    items_page(limit: 100) {\n      items {\n        id\n        name\n        column_values {\n          id\n          text\n          value\n          type\n        }\n      }\n    }\n  }\n}": typeof types.GetBoardDocument,
    "query GetItem($itemId: ID!) {\n  items(ids: [$itemId]) {\n    id\n    name\n    board {\n      id\n      name\n    }\n    group {\n      id\n      title\n    }\n    column_values {\n      id\n      text\n      value\n      type\n    }\n    created_at\n    updated_at\n    creator_id\n    state\n  }\n}": typeof types.GetItemDocument,
    "mutation ChangeColumnValue($itemId: ID!, $boardId: ID!, $columnId: String!, $value: JSON!) {\n  change_column_value(\n    item_id: $itemId\n    board_id: $boardId\n    column_id: $columnId\n    value: $value\n  ) {\n    id\n    name\n    column_values {\n      id\n      text\n      value\n      type\n    }\n  }\n}\n\nmutation CreateUpdate($itemId: ID!, $updateText: String!) {\n  create_update(item_id: $itemId, body: $updateText) {\n    id\n    body\n    created_at\n    creator {\n      id\n      name\n    }\n  }\n}\n\nmutation CreateItem($boardId: ID!, $itemName: String!, $columnValues: JSON) {\n  create_item(\n    board_id: $boardId\n    item_name: $itemName\n    column_values: $columnValues\n  ) {\n    id\n    name\n    board {\n      id\n    }\n    column_values {\n      id\n      text\n      value\n    }\n  }\n}": typeof types.ChangeColumnValueDocument,
    "query GetUser($userId: ID!) {\n  users(ids: [$userId]) {\n    id\n    name\n    email\n    photo_thumb_small\n    title\n    phone\n    location\n    teams {\n      id\n      name\n    }\n  }\n}": typeof types.GetUserDocument,
};
const documents: Documents = {
    "query GetBoard($boardId: ID!) {\n  boards(ids: [$boardId]) {\n    id\n    name\n    description\n    columns {\n      id\n      title\n      type\n    }\n    items_count\n    groups {\n      id\n      title\n    }\n    items_page(limit: 100) {\n      items {\n        id\n        name\n        column_values {\n          id\n          text\n          value\n          type\n        }\n      }\n    }\n  }\n}": types.GetBoardDocument,
    "query GetItem($itemId: ID!) {\n  items(ids: [$itemId]) {\n    id\n    name\n    board {\n      id\n      name\n    }\n    group {\n      id\n      title\n    }\n    column_values {\n      id\n      text\n      value\n      type\n    }\n    created_at\n    updated_at\n    creator_id\n    state\n  }\n}": types.GetItemDocument,
    "mutation ChangeColumnValue($itemId: ID!, $boardId: ID!, $columnId: String!, $value: JSON!) {\n  change_column_value(\n    item_id: $itemId\n    board_id: $boardId\n    column_id: $columnId\n    value: $value\n  ) {\n    id\n    name\n    column_values {\n      id\n      text\n      value\n      type\n    }\n  }\n}\n\nmutation CreateUpdate($itemId: ID!, $updateText: String!) {\n  create_update(item_id: $itemId, body: $updateText) {\n    id\n    body\n    created_at\n    creator {\n      id\n      name\n    }\n  }\n}\n\nmutation CreateItem($boardId: ID!, $itemName: String!, $columnValues: JSON) {\n  create_item(\n    board_id: $boardId\n    item_name: $itemName\n    column_values: $columnValues\n  ) {\n    id\n    name\n    board {\n      id\n    }\n    column_values {\n      id\n      text\n      value\n    }\n  }\n}": types.ChangeColumnValueDocument,
    "query GetUser($userId: ID!) {\n  users(ids: [$userId]) {\n    id\n    name\n    email\n    photo_thumb_small\n    title\n    phone\n    location\n    teams {\n      id\n      name\n    }\n  }\n}": types.GetUserDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query GetBoard($boardId: ID!) {\n  boards(ids: [$boardId]) {\n    id\n    name\n    description\n    columns {\n      id\n      title\n      type\n    }\n    items_count\n    groups {\n      id\n      title\n    }\n    items_page(limit: 100) {\n      items {\n        id\n        name\n        column_values {\n          id\n          text\n          value\n          type\n        }\n      }\n    }\n  }\n}"): (typeof documents)["query GetBoard($boardId: ID!) {\n  boards(ids: [$boardId]) {\n    id\n    name\n    description\n    columns {\n      id\n      title\n      type\n    }\n    items_count\n    groups {\n      id\n      title\n    }\n    items_page(limit: 100) {\n      items {\n        id\n        name\n        column_values {\n          id\n          text\n          value\n          type\n        }\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query GetItem($itemId: ID!) {\n  items(ids: [$itemId]) {\n    id\n    name\n    board {\n      id\n      name\n    }\n    group {\n      id\n      title\n    }\n    column_values {\n      id\n      text\n      value\n      type\n    }\n    created_at\n    updated_at\n    creator_id\n    state\n  }\n}"): (typeof documents)["query GetItem($itemId: ID!) {\n  items(ids: [$itemId]) {\n    id\n    name\n    board {\n      id\n      name\n    }\n    group {\n      id\n      title\n    }\n    column_values {\n      id\n      text\n      value\n      type\n    }\n    created_at\n    updated_at\n    creator_id\n    state\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation ChangeColumnValue($itemId: ID!, $boardId: ID!, $columnId: String!, $value: JSON!) {\n  change_column_value(\n    item_id: $itemId\n    board_id: $boardId\n    column_id: $columnId\n    value: $value\n  ) {\n    id\n    name\n    column_values {\n      id\n      text\n      value\n      type\n    }\n  }\n}\n\nmutation CreateUpdate($itemId: ID!, $updateText: String!) {\n  create_update(item_id: $itemId, body: $updateText) {\n    id\n    body\n    created_at\n    creator {\n      id\n      name\n    }\n  }\n}\n\nmutation CreateItem($boardId: ID!, $itemName: String!, $columnValues: JSON) {\n  create_item(\n    board_id: $boardId\n    item_name: $itemName\n    column_values: $columnValues\n  ) {\n    id\n    name\n    board {\n      id\n    }\n    column_values {\n      id\n      text\n      value\n    }\n  }\n}"): (typeof documents)["mutation ChangeColumnValue($itemId: ID!, $boardId: ID!, $columnId: String!, $value: JSON!) {\n  change_column_value(\n    item_id: $itemId\n    board_id: $boardId\n    column_id: $columnId\n    value: $value\n  ) {\n    id\n    name\n    column_values {\n      id\n      text\n      value\n      type\n    }\n  }\n}\n\nmutation CreateUpdate($itemId: ID!, $updateText: String!) {\n  create_update(item_id: $itemId, body: $updateText) {\n    id\n    body\n    created_at\n    creator {\n      id\n      name\n    }\n  }\n}\n\nmutation CreateItem($boardId: ID!, $itemName: String!, $columnValues: JSON) {\n  create_item(\n    board_id: $boardId\n    item_name: $itemName\n    column_values: $columnValues\n  ) {\n    id\n    name\n    board {\n      id\n    }\n    column_values {\n      id\n      text\n      value\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query GetUser($userId: ID!) {\n  users(ids: [$userId]) {\n    id\n    name\n    email\n    photo_thumb_small\n    title\n    phone\n    location\n    teams {\n      id\n      name\n    }\n  }\n}"): (typeof documents)["query GetUser($userId: ID!) {\n  users(ids: [$userId]) {\n    id\n    name\n    email\n    photo_thumb_small\n    title\n    phone\n    location\n    teams {\n      id\n      name\n    }\n  }\n}"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;