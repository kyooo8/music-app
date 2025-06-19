import { getOctaveAdjustedNote, getDramInstrumentName } from "../playMusicLogic";

describe("getOctaveAdjustedNote", () => {
  const sortedMelody = {
    0: { name: "C", index: 0, octave: 3 },
    1: { name: "D", index: 1, octave: 4 },
  } as const;

  test("returns note with same octave for melody", () => {
    const result = getOctaveAdjustedNote("C", 0, false, sortedMelody as any);
    expect(result).toBe("3C");
  });

  test("subtracts two octaves for bass", () => {
    const result = getOctaveAdjustedNote("D", 1, true, sortedMelody as any);
    expect(result).toBe("2D");
  });
});

describe("getDramInstrumentName", () => {
  test("returns correct instrument name from index", () => {
    expect(getDramInstrumentName(0)).toBe("hand-clap");
    expect(getDramInstrumentName(8)).toBe("bass-drum");
  });

  test("returns 'snare' for out of range index", () => {
    expect(getDramInstrumentName(99)).toBe("snare");
  });
});
