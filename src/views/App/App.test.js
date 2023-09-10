import ShallowRenderer from "react-test-renderer/shallow";
import App from "./App";

describe("App Test Suite", () => {
  test("renders without failing", () => {
    const renderer = new ShallowRenderer();
    renderer.render(<App />);
    const view = renderer.getRenderOutput();

    expect(view.type).toBe("div");
  });
});
