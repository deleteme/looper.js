import timeout from "../src/timeout";

describe("timeout()", () => {
  it("should return a Promise that resolves with the callback value after a delay.", async () => {
    const callback = jest.fn(() => "the value");
    expect(callback).not.toHaveBeenCalled();
    const value = await timeout(callback, 50);
    expect(value).toBe("the value");
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
