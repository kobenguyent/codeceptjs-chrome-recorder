import { InMemoryLineWriter } from './InMemoryLineWriter';
import { CodeceptjsStringifyExtension } from '../src/codeceptjsStringifyExtension';
import { expect } from 'chai';
import { Step, StepType, AssertedEventType } from '@puppeteer/replay';

describe('CodeceptJSStringifyExtension', () => {
  test('should correctly exports setViewport step', async () => {
    const ext = new CodeceptjsStringifyExtension();
    const step: Step = {
      type: StepType.SetViewport,
      width: 1905,
      height: 223
    } as Step;
    const flow = { title: 'setViewport step', steps: [step] };

    const writer = new InMemoryLineWriter('  ');
    await ext.stringifyStep(writer, step, flow);
    expect(writer.toString()).to.equal(
      'I.resizeWindow(1905, 223)\n',
    );
  });

  test('should correctly exports navigate step', async () => {
    const ext = new CodeceptjsStringifyExtension();
    const step: Step = {
      type: StepType.Navigate ,
      url: 'chrome://new-tab-page/',
      assertedEvents: [
        {
          type: AssertedEventType.Navigation ,
          url: 'chrome://new-tab-page/',
          title: 'New Tab',
        },
      ],
    };
    const flow = { title: 'navigate step', steps: [step] };

    const writer = new InMemoryLineWriter('  ');
    await ext.stringifyStep(writer, step, flow);
    expect(writer.toString()).to.equal(
      'I.amOnPage("chrome://new-tab-page/")\n',
    );
  });

  test('should correctly exports click step', async () => {
    const ext = new CodeceptjsStringifyExtension();
    const step: Step = {
      type: StepType.Click ,
      target: 'main',
      selectors: ['#test'],
      offsetX: 1,
      offsetY: 1,
    };
    const flow = { title: 'click step', steps: [step] };

    const writer = new InMemoryLineWriter('  ');
    await ext.stringifyStep(writer, step, flow);

    expect(writer.toString()).to.equal('I.click("#test")\n');
  });

  test('should correctly exports keyDown step', async () => {
    const ext = new CodeceptjsStringifyExtension();
    const step: Step = {
      type: StepType.KeyDown ,
      target: 'main',
      key: 'Enter' ,
      assertedEvents: [
        {
          type: AssertedEventType.Navigation ,
          url: 'https://google.com',
          title: 'Google Search',
        },
      ],
    };
    const flow = { title: 'keyDown step', steps: [step] };

    const writer = new InMemoryLineWriter('  ');
    await ext.stringifyStep(writer, step, flow);

    expect(writer.toString()).to.equal(
      `I.pressKeyDown('ENTER')\n`,
    );
  });

  test('should correctly exports keyUp step', async () => {
    const ext = new CodeceptjsStringifyExtension();
    const step: Step = {
      type: StepType.KeyUp ,
      target: 'main',
      key: 'Enter' ,
      assertedEvents: [
        {
          type: AssertedEventType.Navigation ,
          url: 'https://google.com',
          title: 'Google Search',
        },
      ],
    };
    const flow = { title: 'keyUp step', steps: [step] };

    const writer = new InMemoryLineWriter('  ');
    await ext.stringifyStep(writer, step, flow);

    expect(writer.toString()).to.equal(
      `I.pressKeyUp('ENTER')\n`,
    );
  });

  test('should correctly exports scroll step', async () => {
    const ext = new CodeceptjsStringifyExtension();
    const step: Step = {
      type: StepType.Scroll ,
      target: 'main',
      x: 0,
      y: 805,
    };
    const flow = { title: 'scroll step', steps: [step] };

    const writer = new InMemoryLineWriter('  ');
    await ext.stringifyStep(writer, step, flow);

    expect(writer.toString()).to.equal(`I.scrollTo(0, 805)\n`);
  });

  test('should correctly exports doubleClick step', async () => {
    const ext = new CodeceptjsStringifyExtension();
    const step: Step = {
      type: StepType.DoubleClick ,
      target: 'main',
      selectors: [['aria/Test'], ['#test']],
      offsetX: 1,
      offsetY: 1,
    };
    const flow = { title: 'doubleClick step', steps: [step] };

    const writer = new InMemoryLineWriter('  ');
    await ext.stringifyStep(writer, step, flow);

    expect(writer.toString()).to.equal(`I.doubleClick("#test")\n`);
  });

  test('should correctly exports waitForElement step', async () => {
    const ext = new CodeceptjsStringifyExtension();
    const step: Step = {
      type: StepType.WaitForElement ,
      selectors: ['#test']
    };
    const flow = { title: 'waitForElement step', steps: [step] };

    const writer = new InMemoryLineWriter('  ');
    await ext.stringifyStep(writer, step, flow);

    expect(writer.toString()).to.equal(`
      I.waitForElement("#test")\n`);
  });

  test('should correctly add Hover Step', async () => {
    const ext = new CodeceptjsStringifyExtension();
    const step: Step = {
      type: StepType.Hover ,
      selectors: ['#test'],
    };
    const flow = { title: 'Hover step', steps: [step] };

    const writer = new InMemoryLineWriter('  ');
    await ext.stringifyStep(writer, step, flow);

    expect(writer.toString()).to.equal(`I.moveCursorTo("#test", 0, 0)\n`);
  });
});
