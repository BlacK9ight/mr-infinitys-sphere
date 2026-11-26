// Messages for the error codes the post actions put in the address (?error=...).
export const POST_ERRORS: Record<string, string> = {
  missing: "Please add a title. The slug can stay empty.",
  reserved: "That slug is reserved. Please choose another one.",
  exists: "A post with that slug already exists. Please choose another one.",
  empty: "Add some content before publishing. You can save it as a draft instead.",
};
