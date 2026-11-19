export type FormState = {
  status: "idle" | "success" | "error";
  message: string;
  // Echoed back on errors so the form doesn't lose what the visitor typed.
  fields?: { email?: string; message?: string };
};
