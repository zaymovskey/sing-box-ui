export type ServerApiIssue = {
  path?: string;
  message: string;
  code?: string;
};

export class ServerApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public issues?: ServerApiIssue[],
  ) {
    super(message);
  }
}
