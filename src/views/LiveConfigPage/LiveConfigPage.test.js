import ShallowRenderer from 'react-test-renderer/shallow';
import LiveConfigPage from './LiveConfigPage';

describe("LiveConfigPage Test Suite", () => {
    test('renders without failing', () => {
        const renderer = new ShallowRenderer();
        renderer.render(<LiveConfigPage />);
        const view = renderer.getRenderOutput();

        expect(view.type).toBe("div");
    });
});