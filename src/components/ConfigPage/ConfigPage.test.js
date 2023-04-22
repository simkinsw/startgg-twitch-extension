import ShallowRenderer from 'react-test-renderer/shallow';
import ConfigPage from './ConfigPage';

describe("ConfigPage Test Suite", () => {
    test('renders without failing', () => {
        const renderer = new ShallowRenderer();
        renderer.render(<ConfigPage />);
        const view = renderer.getRenderOutput();

        expect(view.type).toBe("div");
    });
});