import { describe, it, expect } from "vitest";
import { getMentionUser, removeLeadingMention } from "@/shared/commentsUtils";

describe("mention helpers", () => {
  it("extracts leading @username", () => {
    expect(getMentionUser("@alice Hello"))?.toBe("alice");
    expect(getMentionUser("   @bob   Hi"))?.toBe("bob");
  });

  it("returns null when no leading @mention", () => {
    expect(getMentionUser("Hello @charlie"))?.toBeNull();
    expect(getMentionUser("No mention here"))?.toBeNull();
    expect(getMentionUser("")).toBeNull();
  });

  it("removes leading @mention and preserves rest", () => {
    expect(removeLeadingMention("@alice Hello world"))?.toBe("Hello world");
    expect(removeLeadingMention("   @bob   Hi there"))?.toBe("Hi there");
  });

  it("leaves text unchanged when mention not at start", () => {
    expect(removeLeadingMention("Hello @alice"))?.toBe("Hello @alice");
  });
});