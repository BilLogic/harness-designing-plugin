/**
 * Local Lit stub — visually approximates Material 3 Filled Button.
 * Mirrors API shape from material-web (https://github.com/material-components/material-web/tree/main/button).
 *
 * Not an `npm install @material/web` import — kept self-contained so the
 * exemplar reads end-to-end without touching @material/web's full bundle.
 */
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('md-filled-button')
export class MdFilledButton extends LitElement {
  static styles = css`
    :host {
      display: inline-flex;
    }
    button {
      height: 40px;
      padding: 0 24px;
      border: none;
      border-radius: var(--md-sys-shape-corner-extra-large);
      background: var(--md-sys-color-primary);
      color: var(--md-sys-color-on-primary);
      font-family: var(--md-sys-typescale-label-large-font);
      font-size: var(--md-sys-typescale-label-large-size);
      font-weight: var(--md-sys-typescale-label-large-weight);
      line-height: var(--md-sys-typescale-label-large-line-height);
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: box-shadow 200ms;
    }
    button:hover { box-shadow: var(--md-sys-elevation-level1); }
    button:hover::before {
      content: '';
      position: absolute;
      inset: 0;
      background: var(--md-sys-color-on-primary);
      opacity: var(--md-sys-state-hover-state-layer-opacity);
      pointer-events: none;
    }
    button:disabled {
      background: color-mix(in oklab, var(--md-sys-color-on-surface) 12%, transparent);
      color: color-mix(in oklab, var(--md-sys-color-on-surface) 38%, transparent);
      cursor: not-allowed;
      box-shadow: none;
    }
  `;

  @property({ type: Boolean }) disabled = false;
  @property({ type: String }) label = '';

  override render() {
    return html`
      <button ?disabled=${this.disabled}>
        <slot>${this.label}</slot>
      </button>
    `;
  }
}
