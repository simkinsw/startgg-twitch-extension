import ShallowRenderer from "react-test-renderer/shallow";
import VideoComponentPage from "./VideoComponentPage";

describe("VideoComponentPage Test Suite", () => {
  test("renders without failing", () => {
    const renderer = new ShallowRenderer();
    renderer.render(<VideoComponentPage />);
    const view = renderer.getRenderOutput();

    expect(view.type).toBe("div");
  });
});
