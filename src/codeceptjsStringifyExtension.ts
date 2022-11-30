import {
  ChangeStep,
  ClickStep,
  DoubleClickStep,
  EmulateNetworkConditionsStep,
  HoverStep,
  KeyDownStep,
  KeyUpStep,
  LineWriter,
  NavigateStep,
  PuppeteerStringifyExtension,
  ScrollStep,
  Selector,
  SetViewportStep,
  Step,
  UserFlow,
  WaitForElementStep,
  StepType,
} from '@puppeteer/replay';
import { SupportedKeys, DowncaseKeys } from './types';

export class CodeceptjsStringifyExtension extends PuppeteerStringifyExtension {
  #formatAsJSLiteral(value: string) {
    return JSON.stringify(value);
  }

  async beforeAllSteps(out: LineWriter, flow: UserFlow): Promise<void> {
    out.appendLine(`Feature('${this.#formatAsJSLiteral(flow.title)}');\n`)
    out.appendLine(`Before(() => {

    });\n`)
    out.appendLine(
        `Scenario((${this.#formatAsJSLiteral(flow.title)}), async ({ I }) => {
          `,
      )
      .startBlock();
  }

  async afterAllSteps(out: LineWriter): Promise<void> {
    out.appendLine('});').endBlock();
  }

  async stringifyStep(
    out: LineWriter,
    step: Step,
    flow: UserFlow,
  ): Promise<void> {
    this.#appendStepType(out, step, flow);
  }

  #appendStepType(out: LineWriter, step: Step, flow: UserFlow): void {
    switch (step.type) {
      case StepType.SetViewport:
        return this.#appendViewportStep(out, step);
      case StepType.Navigate:
        return this.#appendNavigateStep(out, step);
      case StepType.Click:
        return this.#appendClickStep(out, step, flow);
      case StepType.KeyDown:
        return this.#appendKeyDownStep(out, step);
      case StepType.KeyUp:
        return this.#appendKeyUpStep(out, step);
      case StepType.Scroll:
        return this.#appendScrollStep(out, step, flow);
      case StepType.DoubleClick:
        return this.#appendDoubleClickStep(out, step, flow);
      case StepType.Hover:
        return this.#appendHoverStep(out, step, flow);
      case StepType.WaitForElement:
        return this.#appendWaitForElementStep(out, step, flow);
      default:
        return this.logStepsNotImplemented(step);
    }
  }

  #appendNavigateStep(out: LineWriter, step: NavigateStep): void {
    out.appendLine(`I.amOnPage(${this.#formatAsJSLiteral(step.url)})`);
  }

  #appendViewportStep(out: LineWriter, step: SetViewportStep): void {
    out.appendLine(
      `I.resizeWindow(${step.width}, ${step.height})`,
    );
  }

  #appendClickStep(out: LineWriter, step: ClickStep, flow: UserFlow): void {
    const domSelector = this.getSelector(step.selectors, flow);

    const hasRightButton = step.button && step.button === 'secondary';
    if (domSelector) {
      hasRightButton
        ? out.appendLine(`I.rightClick(${domSelector})`)
        : out.appendLine(`I.click(${domSelector})`);
    } else {
      console.log(
        `Warning: The click on ${step.selectors} was not able to export to CodeceptJS. Please adjust selectors and try again`,
      );
    }
  }

  #appendKeyDownStep(out: LineWriter, step: KeyDownStep): void {
    const pressedKey = step.key.toLowerCase() as DowncaseKeys;

    if (pressedKey in SupportedKeys) {
      const keyValue = SupportedKeys[pressedKey];
      out.appendLine(`I.pressKeyDown('${keyValue}')`);
    }
  
  }

  #appendKeyUpStep(out: LineWriter, step: KeyUpStep): void {
    const pressedKey = step.key.toLowerCase() as DowncaseKeys;

    if (pressedKey in SupportedKeys) {
      const keyValue = SupportedKeys[pressedKey];
      out.appendLine(`I.pressKeyUp('${keyValue}')`);
    }
  }

  #appendScrollStep(out: LineWriter, step: ScrollStep, flow: UserFlow): void {
    if ('selectors' in step) {
      const domSelector = this.getSelector(step.selectors, flow);
      out.appendLine(`I.scrollTo(${domSelector}, 0, 0)`);
    } else {
      out.appendLine(`I.scrollTo(${step.x}, ${step.y})`);
    }
  }

  #appendDoubleClickStep(
    out: LineWriter,
    step: DoubleClickStep,
    flow: UserFlow,
  ): void {
    const domSelector = this.getSelector(step.selectors, flow);

    if (domSelector) {
      out.appendLine(`I.doubleClick(${domSelector})`);
    } else {
      console.log(
        `Warning: The click on ${step.selectors} was not able to be exported to CodeceptJS. Please adjust your selectors and try again.`,
      );
    }
  }

  #appendHoverStep(out: LineWriter, step: HoverStep, flow: UserFlow): void {
    const domSelector = this.getSelector(step.selectors, flow);

    if (domSelector) {
      out.appendLine(`I.moveCursorTo(${domSelector}, 0, 0)`);
    } else {
      console.log(
        `Warning: The Hover on ${step.selectors} was not able to be exported to CodeceptJS. Please adjust your selectors and try again.`,
      );
    }
  }

  #appendWaitForElementStep(
    out: LineWriter,
    step: WaitForElementStep,
    flow: UserFlow,
  ): void {
    const domSelector = this.getSelector(step.selectors, flow);
    let assertionStatement;
    if (domSelector) {
      out.appendLine(`
      I.waitForElement(${domSelector})`);
    } else {
      console.log(
        `Warning: The WaitForElement on ${step.selectors} was not able to be exported to CodeceptJS. Please adjust your selectors and try again.`,
      );
    }
  }

  getSelector(selectors: Selector[], flow: UserFlow): string | undefined {
    // Remove Aria selectors
    const nonAriaSelectors = this.filterArrayByString(selectors, 'aria/');

    let preferredSelector;

    // Give preference to user selector
    if (flow && flow.selectorAttribute) {
      preferredSelector = this.filterArrayByString(
        nonAriaSelectors,
        flow.selectorAttribute,
      );
    }

    if (preferredSelector && preferredSelector[0]) {
      return `${this.#formatAsJSLiteral(
        Array.isArray(preferredSelector[0])
          ? preferredSelector[0][0]
          : preferredSelector[0],
      )}`;
    } else {
      return `${this.#formatAsJSLiteral(
        Array.isArray(nonAriaSelectors[0])
          ? nonAriaSelectors[0][0]
          : nonAriaSelectors[0],
      )}`;
    }
  }

  filterArrayByString(selectors: Selector[], filterValue: string): Selector[] {
    return selectors.filter((selector) =>
      filterValue === 'aria/'
        ? !selector[0].includes(filterValue)
        : selector[0].includes(filterValue),
    );
  }

  logStepsNotImplemented(step: Step): void {
    console.log(
      `Warning: CodeceptJS Chrome Recorder does not handle migration of types ${step.type}.`,
    );
  }
}
