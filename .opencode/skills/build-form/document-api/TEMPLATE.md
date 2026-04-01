# API Documentation Template

Use this structure when writing `docs/api.md` (or the path the user specifies).

---

````markdown
# {Service Name} API Reference

> Generated from source at `{SOURCE_PATH}`.
> Last updated: {DATE}

## Authentication

### {Auth Scheme — e.g. Bearer Token / API Key / OAuth}

{Document the auth flow: how tokens are obtained and used in requests}

## REST Endpoints

### {Resource Group — e.g. Users}

#### `POST /api/{resource}` — Create {Resource}

- **Auth**: {auth requirement}
- **Request body**:
  ```typescript
  {
    field: type;
  }
  ```
````

- **Response**:
  ```typescript
  {
    id: string;
  }
  ```

#### `GET /api/{resource}/{id}` — Get {Resource}

{...}

#### `PUT /api/{resource}/{id}` — Update {Resource}

{...}

#### `DELETE /api/{resource}/{id}` — Delete {Resource}

{...}

{Repeat pattern for each resource group and its endpoints}

### Webhooks & Integrations

{Document any inbound or outbound webhooks, including payload shapes and auth}

## RPC Procedures (tRPC / oRPC / gRPC / etc.)

### {Router / Service Name}

#### `{procedureName}` — {query | mutation | subscription}

- **Input**:
  ```typescript
  {}
  ```
- **Output**:
  ```typescript
  {}
  ```

{Repeat for each procedure}

## oRPC Procedures

> oRPC procedures are defined with `os.input(...).handler(...)` and exposed via a router object. Document each router and its procedures.

### `{routerName}.{procedureName}`

- **Type**: {query (GET) | mutation (POST/PUT/DELETE)}
- **Input** (Zod schema):
  ```typescript
  z.object({
    field: z.type(),
  })
  ```
- **Output**:
  ```typescript
  {
    field: type;
  }
  ```
- **Auth**: {public | protected — describe middleware used}
- **Side effects**: {e.g. sends email, triggers job, none}

{Repeat for each procedure}

### ability

{List each procedure with input/output types}

### users

{...}

### videoResources

{...}

### posts

{...}

{Repeat for each tRPC router}

## Data Models

### Key Database Tables

{Table name, columns, relationships — only the ones relevant to API contracts}

## Changelog

| Date   | Change                |
| ------ | --------------------- |
| {DATE} | Initial documentation |

```

```
