declare namespace Express {
  interface Request {
    uid: string;
    userEmail?: string;
  }
}
