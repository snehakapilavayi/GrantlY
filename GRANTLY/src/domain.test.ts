import { test } from "node:test";
import assert from "node:assert/strict";
import {
  initialState,
  oneAway,
  fit,
  missing,
  scholarships,
  funding,
  incompatible,
} from "./domain";
test("one prepared document opens exactly two original-demo applications", () => {
  const st = initialState();
  const g = oneAway(st).find(([id]) => id === "income");
  assert.equal(g?.[1].length, 2);
  st.prepared.push("income");
  for (const s of g![1]) assert.equal(missing(s, st.prepared).length, 0);
  assert.equal(
    oneAway(st).some(([id]) => id === "income"),
    false,
  );
});
test("eligibility changes with profile, independently of documents", () => {
  const s = scholarships[0],
    st = initialState();
  assert.equal(fit(s, st.profile), "met");
  assert.equal(missing(s, st.prepared).length, 1);
  st.profile.income = 600000;
  assert.equal(fit(s, st.profile), "unmet");
});
test("unknown optional information remains unknown", () => {
  const st = initialState();
  st.profile.firstGen = "Prefer not to say";
  assert.equal(
    fit(
      scholarships.find((s) => s.id === "roots")!,
      st.profile,
    ),
    "unknown",
  );
});
test("funding separates saved from selected and caps gap at zero", () => {
  const st = initialState();
  assert.equal(funding(st).potential, 0);
  st.selected = ["udaan", "next"];
  assert.equal(funding(st).gap, 25000);
  st.selected.push("build");
  assert.equal(funding(st).gap, 0);
  assert.equal(funding(st).excess, 20000);
});
test("merit awards conflict deterministically", () => {
  assert.equal(
    incompatible(
      scholarships.find((s) => s.id === "horizon")!,
      scholarships.find((s) => s.id === "ascent")!,
    ),
    true,
  );
  assert.equal(incompatible(scholarships[0], scholarships[1]), false);
});
